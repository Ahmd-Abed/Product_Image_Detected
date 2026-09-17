"""API regression checks isolated from MongoDB and model downloads."""
import importlib.util
import io
import os
from pathlib import Path
import re
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from bson import ObjectId
from fastapi.testclient import TestClient
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("tested_app", ROOT / "main.py")
backend = importlib.util.module_from_spec(spec)
with patch.dict(os.environ, {"MONGODB_URI": "mongodb://unused"}):
    spec.loader.exec_module(backend)


def picture(color="green"):
    output = io.BytesIO()
    Image.new("RGB", (16, 16), color).save(output, "PNG")
    return output.getvalue()


class Cursor:
    def __init__(self, items):
        self.items, self.start, self.size = items, 0, None

    def sort(self, fields):
        for key, direction in reversed(fields):
            self.items.sort(key=lambda item: item.get(key, ""), reverse=direction == -1)
        return self

    def skip(self, start):
        self.start = start
        return self

    def limit(self, size):
        self.size = size
        return self

    def __aiter__(self):
        async def iterate():
            end = self.start + self.size if self.size is not None else None
            for item in self.items[self.start:end]:
                yield item
        return iterate()


class Collection:
    def __init__(self):
        self.items = []

    def matches(self, item, query):
        if "_id" in query:
            return item["_id"] == query["_id"]
        if "$or" in query:
            return any(re.search(condition["$regex"], item.get(field) or "", re.I)
                       for entry in query["$or"] for field, condition in entry.items())
        return True

    @staticmethod
    def project(item, projection):
        if not projection:
            return dict(item)
        if any(projection.values()):
            return {key: value for key, value in item.items() if key == "_id" or projection.get(key)}
        return {key: value for key, value in item.items() if projection.get(key) != 0}

    def find(self, query, projection=None):
        return Cursor([self.project(item, projection) for item in self.items if self.matches(item, query)])

    async def count_documents(self, query):
        return sum(self.matches(item, query) for item in self.items)

    async def find_one(self, query, projection=None):
        return next((self.project(item, projection) for item in self.items if self.matches(item, query)), None)

    async def insert_one(self, document):
        document = dict(document, _id=ObjectId())
        self.items.append(document)
        return SimpleNamespace(inserted_id=document["_id"])

    async def update_one(self, query, changes):
        for item in self.items:
            if self.matches(item, query):
                item.update(changes["$set"])
                return SimpleNamespace(matched_count=1)
        return SimpleNamespace(matched_count=0)

    async def delete_one(self, query):
        for item in self.items:
            if self.matches(item, query):
                self.items.remove(item)
                return SimpleNamespace(deleted_count=1)
        return SimpleNamespace(deleted_count=0)


class ProductAPI(unittest.TestCase):
    def setUp(self):
        self.collection = Collection()
        backend.app.state.products = self.collection
        # Skip the live database lifespan by not entering TestClient as a context.
        self.client = TestClient(backend.app)
        embedding = patch.object(backend, "create_image_embedding", return_value=[1.0, 0.0])
        embedding.start()
        self.addCleanup(embedding.stop)
        self.addCleanup(self.client.close)

    def add(self, title="Green mug", image=None):
        response = self.client.post("/addProduct", data={"title": title, "price": "12.50", "desc": "Ceramic"},
                                    files={"image": ("photo.png", image or picture(), "image/png")})
        self.assertEqual(response.status_code, 200, response.text)
        return response.json()["product"]["id"]

    def test_frontend_and_config(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn('lang="ar" dir="rtl"', response.text)
        for asset in ("app.js", "styles.css", "placeholder.svg"):
            self.assertEqual(self.client.get(f"/static/{asset}").status_code, 200)
        self.assertEqual(self.client.get("/app-config").json()["max_image_mb"], backend.MAX_IMAGE_MB)

    def test_pagination_literal_search_and_order(self):
        ids = [self.add(f"Item {number}") for number in range(7)]
        result = self.client.get("/products").json()
        self.assertEqual((result["total"], result["page_size"], result["total_pages"]), (7, 5, 2))
        self.assertEqual(len(result["data"]), 5)
        self.assertEqual(result["data"][0]["id"], ids[-1])
        self.assertNotIn("image", result["data"][0])
        self.assertNotIn("embedding", result["data"][0])
        second = self.client.get("/products?page=2").json()["data"]
        self.assertEqual(len(second), 2)
        self.assertFalse({item["id"] for item in second} & {item["id"] for item in result["data"]})
        self.add("Cup [blue].")
        self.assertEqual(self.client.get("/products", params={"search": "[blue]."}).json()["total"], 1)
        self.assertEqual(self.client.get("/products", params={"search": "CERAMIC"}).json()["total"], 8)
        self.assertEqual(self.client.get("/products?page_size=999").json()["page_size"], 100)
        self.assertEqual(self.client.get("/products?page_size=0&page=0").json()["page_size"], 5)

    def test_image_and_edit_without_replacing_photo(self):
        original = picture()
        product_id = self.add(image=original)
        response = self.client.get(f"/products/{product_id}/image")
        self.assertEqual(response.content, original)
        self.assertEqual(response.headers["content-type"], "image/png")
        response = self.client.put(f"/products/{product_id}", data={"title": "Updated", "price": "0", "desc": ""})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.collection.items[0]["desc"], "")
        self.assertEqual(self.collection.items[0]["price"], 0)
        self.assertEqual(bytes(self.collection.items[0]["image"]), original)

    def test_replacement_embedding_and_atomic_failure(self):
        product_id = self.add()
        replacement = picture("red")
        with patch.object(backend, "create_image_embedding", return_value=[0.0, 1.0]):
            response = self.client.put(f"/products/{product_id}", data={"title": "Red mug", "price": "10"},
                                       files={"image": ("red.png", replacement, "image/png")})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.collection.items[0]["embedding"], [0.0, 1.0])
        self.assertEqual(bytes(self.collection.items[0]["image"]), replacement)
        with patch.object(backend, "create_image_embedding", side_effect=ValueError("Invalid image file")):
            response = self.client.put(f"/products/{product_id}", data={"title": "Bad change", "price": "10"},
                                       files={"image": ("bad.png", b"invalid", "image/png")})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.collection.items[0]["title"], "Red mug")
        self.assertEqual(bytes(self.collection.items[0]["image"]), replacement)

    def test_validation_and_missing_products(self):
        product_id = self.add()
        for value in ("-1", "nan", "inf"):
            response = self.client.put(f"/products/{product_id}", data={"title": "Cup", "price": value})
            self.assertEqual(response.status_code, 422, response.text)
        self.assertEqual(self.client.get("/products/not-an-id/image").status_code, 400)
        self.assertEqual(self.client.get(f"/products/{ObjectId()}/image").status_code, 404)
        response = self.client.post("/addProduct", data={"price": "10"}, files={"image": ("bad.gif", b"bad", "image/gif")})
        self.assertEqual(response.status_code, 400)
        with patch.object(backend, "MAX_IMAGE_BYTES", 2):
            response = self.client.post("/addProduct", data={"price": "10"}, files={"image": ("big.png", picture(), "image/png")})
            self.assertEqual(response.status_code, 413)

    def test_recognition_match_no_match_and_delete(self):
        product_id = self.add()
        response = self.client.post("/getProductByImage", files={"image": ("query.png", picture(), "image/png")})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["product"]["id"], product_id)
        self.assertEqual(response.json()["similarity"], 1.0)
        with patch.object(backend, "create_image_embedding", return_value=[0.0, 1.0]):
            response = self.client.post("/getProductByImage", files={"image": ("query.png", picture(), "image/png")})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.client.delete(f"/products/{product_id}").status_code, 200)
        self.assertEqual(self.client.get("/products").json()["total"], 0)
        self.assertEqual(self.client.delete(f"/products/{product_id}").status_code, 404)

    def test_legacy_embedding_is_rebuilt_from_stored_image(self):
        product_id = self.add()
        self.collection.items[0].pop("embedding_model")
        self.collection.items[0]["embedding"] = [0.0, 1.0]
        response = self.client.post("/getProductByImage", files={"image": ("query.png", picture(), "image/png")})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["product"]["id"], product_id)
        self.assertEqual(self.collection.items[0]["embedding"], [1.0, 0.0])
        self.assertEqual(self.collection.items[0]["embedding_model"], backend.EMBEDDING_MODEL)

    def test_existing_patch(self):
        product_id = self.add()
        response = self.client.patch(f"/products/{product_id}", json={"price": 20})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["product"]["price"], 20)
        self.assertEqual(self.client.patch(f"/products/{product_id}", json={"price": -1}).status_code, 422)


if __name__ == "__main__":
    unittest.main()
