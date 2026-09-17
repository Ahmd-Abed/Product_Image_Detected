import os
import io
import base64
import re
from pathlib import Path
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from bson import ObjectId
from math import ceil
import numpy as np

from bson.binary import Binary
from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from pymongo import AsyncMongoClient
from pymongo.server_api import ServerApi
from starlette.concurrency import run_in_threadpool


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "product_ai_db")

MATCH_THRESHOLD = float(
    os.getenv("MATCH_THRESHOLD", "0.70")
)

MAX_IMAGE_MB = int(
    os.getenv("MAX_IMAGE_MB", "5")
)

MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024


if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is missing from .env"
    )


# =========================================================
# IMAGE FINGERPRINT
# =========================================================

EMBEDDING_MODEL = "rgb-histogram-512-v1"
MODEL_NAME = EMBEDDING_MODEL


def create_image_embedding(
    image_bytes: bytes,
) -> list[float]:

    """
    Convert an image to a normalized 512-dimensional color fingerprint.
    This keeps Render free deployments under the 512 MB memory limit.
    """

    try:
        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

    except UnidentifiedImageError:
        raise ValueError(
            "Invalid image file"
        )

    image.thumbnail(
        (256, 256)
    )

    pixels = (
        np.asarray(image, dtype=np.uint8)
        .reshape(-1, 3)
    )

    histogram, _ = np.histogramdd(
        pixels,
        bins=(8, 8, 8),
        range=((0, 256), (0, 256), (0, 256)),
    )

    embedding = histogram.flatten().astype(np.float32)
    norm = np.linalg.norm(embedding)

    if norm == 0:
        raise ValueError(
            "Invalid image file"
        )

    vector = (embedding / norm).tolist()

    return vector


# =========================================================
# DATABASE LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    client = AsyncMongoClient(
        MONGODB_URI,
        server_api=ServerApi("1"),
    )

    database = client[MONGODB_DB]

    try:

        await database.command("ping")

        print(
            "Connected successfully to MongoDB Atlas"
        )

    except Exception as exc:

        print(
            "MongoDB connection failed:",
            exc,
        )

        raise

    app.state.mongo_client = client
    app.state.database = database

    app.state.products = database[
        "products"
    ]

    yield

    await client.close()

    print(
        "MongoDB connection closed"
    )


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="Product Image Recognition API",
    version="1.0.0",
    lifespan=lifespan,
)


# DEV CORS
# Tighten this later for production.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
async def web_app():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/app-config", include_in_schema=False)
async def app_config():
    return {"max_image_mb": MAX_IMAGE_MB}


# =========================================================
# IMAGE VALIDATION
# =========================================================

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


async def read_and_validate_image(
    image: UploadFile,
) -> bytes:

    if image.content_type not in ALLOWED_IMAGE_TYPES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPEG, PNG and WEBP "
                "images are supported."
            ),
        )

    image_bytes = await image.read()

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Image is empty",
        )

    if len(image_bytes) > MAX_IMAGE_BYTES:

        raise HTTPException(
            status_code=413,
            detail=(
                f"Image must be <= "
                f"{MAX_IMAGE_MB} MB"
            ),
        )

    return image_bytes


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health(
    request: Request,
):

    await request.app.state.database.command(
        "ping"
    )

    return {
        "status": "ok",
        "database": "connected",
        "ai_model": MODEL_NAME,
    }


# =========================================================
# API 1
# ADD PRODUCT
# =========================================================

@app.post("/addProduct")
async def add_product(
    request: Request,

    image: UploadFile = File(...),

    price: float = Form(..., ge=0, allow_inf_nan=False),

    title: str | None = Form(None),

    desc: str | None = Form(None),
):

    # ---------------------------------------------
    # Validate image
    # ---------------------------------------------

    image_bytes = await read_and_validate_image(
        image
    )

    # ---------------------------------------------
    # Create AI embedding
    # Run CPU-heavy operation outside event loop
    # ---------------------------------------------

    try:

        embedding = await run_in_threadpool(
            create_image_embedding,
            image_bytes,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    # ---------------------------------------------
    # MongoDB document
    # ---------------------------------------------

    product_document = {

        "title": title,

        "desc": desc,

        "price": float(price),

        "image": Binary(
            image_bytes
        ),

        "image_content_type":
            image.content_type,

        "embedding": embedding,

        "embedding_model": EMBEDDING_MODEL,

        "created_at":
            datetime.now(timezone.utc),
    }

    # ---------------------------------------------
    # Insert product
    # ---------------------------------------------

    result = await (
        request
        .app
        .state
        .products
        .insert_one(product_document)
    )

    return {
        "success": True,

        "message":
            "Product added successfully",

        "product": {
            "id":
                str(result.inserted_id),

            "title":
                title,

            "desc":
                desc,

            "price":
                float(price),

            "image_content_type":
                image.content_type,

            "embedding_dimensions":
                len(embedding),
        },
    }


# =========================================================
# API 2
# FIND PRODUCT FROM IMAGE
# =========================================================

@app.post("/getProductByImage")
async def get_product_by_image(
    request: Request,
    image: UploadFile = File(...),
):

    # ---------------------------------------------
    # Read uploaded camera/query image
    # ---------------------------------------------

    image_bytes = await read_and_validate_image(
        image
    )

    # ---------------------------------------------
    # Create query embedding
    # ---------------------------------------------

    try:

        query_embedding = await run_in_threadpool(
            create_image_embedding,
            image_bytes,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    query_vector = np.asarray(
        query_embedding,
        dtype=np.float32,
    )

    # ---------------------------------------------
    # Retrieve product embeddings
    # We intentionally do NOT download
    # every stored image here.
    # ---------------------------------------------

    cursor = (
        request
        .app
        .state
        .products
        .find(
            {},
            {
                "embedding": 1,
                "embedding_model": 1,
                "image": 1,
            }
        )
    )

    best_product_id = None
    best_similarity = -1.0

    async for document in cursor:

        stored_embedding = document.get(
            "embedding"
        )

        if (
            document.get("embedding_model")
            != EMBEDDING_MODEL
            or not stored_embedding
        ):
            image_data = document.get("image")

            if not image_data:
                continue

            try:
                stored_embedding = await run_in_threadpool(
                    create_image_embedding,
                    bytes(image_data),
                )

            except ValueError:
                continue

            await (
                request
                .app
                .state
                .products
                .update_one(
                    {"_id": document["_id"]},
                    {
                        "$set": {
                            "embedding": stored_embedding,
                            "embedding_model": EMBEDDING_MODEL,
                        }
                    },
                )
            )

        if not stored_embedding:
            continue

        stored_vector = np.asarray(
            stored_embedding,
            dtype=np.float32,
        )

        if (
            stored_vector.shape
            != query_vector.shape
        ):
            continue

        # Both vectors were normalized.
        # Dot product == cosine similarity.

        similarity = float(
            np.dot(
                query_vector,
                stored_vector,
            )
        )

        if similarity > best_similarity:

            best_similarity = similarity

            best_product_id = (
                document["_id"]
            )

    # ---------------------------------------------
    # Nothing in database
    # ---------------------------------------------

    if best_product_id is None:

        raise HTTPException(
            status_code=404,
            detail="No products available",
        )

    # ---------------------------------------------
    # Threshold validation
    # ---------------------------------------------

    if best_similarity < MATCH_THRESHOLD:

        raise HTTPException(
            status_code=404,
            detail={
                "message":
                    "No matching product found",

                "best_similarity":
                    round(
                        best_similarity,
                        4
                    ),

                "required_similarity":
                    MATCH_THRESHOLD,
            },
        )

    # ---------------------------------------------
    # Load full matched product
    # ---------------------------------------------

    product = await (
        request
        .app
        .state
        .products
        .find_one(
            {
                "_id":
                    best_product_id
            }
        )
    )

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    # ---------------------------------------------
    # Convert BSON image -> Base64
    # for JSON response
    # ---------------------------------------------

    image_base64 = base64.b64encode(
        bytes(product["image"])
    ).decode("utf-8")

    # ---------------------------------------------
    # Response
    # ---------------------------------------------

    return {
        "success": True,

        "similarity":
            round(
                best_similarity,
                4
            ),

        "product": {

            "id":
                str(product["_id"]),

            "title":
                product.get("title"),

            "desc":
                product.get("desc"),

            "price":
                product.get("price"),

            "image_content_type":
                product.get(
                    "image_content_type"
                ),

            "image_base64":
                image_base64,
        },

    }
# =========================================================
# GET ALL PRODUCTS
# Pagination + Search
# =========================================================

@app.get("/products")
async def get_all_products(
    request: Request,

    search: str | None = None,

    page: int = 1,

    page_size: int = 5,
):

    if page < 1:
        page = 1

    if page_size < 1:
        page_size = 5

    page_size = min(page_size, 100)


    products_collection = (
        request
        .app
        .state
        .products
    )


    # -----------------------------
    # Search filter
    # -----------------------------

    query = {}


    if search:

        query = {
            "$or": [

                {
                    "title": {
                        "$regex": re.escape(search),
                        "$options": "i"
                    }
                },

                {
                    "desc": {
                        "$regex": re.escape(search),
                        "$options": "i"
                    }
                }

            ]
        }


    # -----------------------------
    # Count
    # -----------------------------

    total = await products_collection.count_documents(
        query
    )


    # -----------------------------
    # Pagination
    # -----------------------------

    skip = (
        page - 1
    ) * page_size


    cursor = (
        products_collection
        .find(
            query,
            {
                # don't return heavy fields
                "embedding": 0,
                "image": 0
            }
        )
        .sort([("created_at", -1), ("_id", -1)])
        .skip(skip)
        .limit(page_size)
    )


    products = []


    async for product in cursor:

        products.append({

            "id":
                str(product["_id"]),

            "image_url": f"/products/{product['_id']}/image",

            "title":
                product.get("title"),

            "desc":
                product.get("desc"),

            "price":
                product.get("price"),

            "image_content_type":
                product.get(
                    "image_content_type"
                ),

            "created_at":
                product.get(
                    "created_at"
                )

        })


    return {

        "page": page,

        "page_size": page_size,

        "total":
            total,

        "total_pages":
            ceil(
                total / page_size
            ),

        "data":
            products

    }

# =========================================================
# DELETE PRODUCT
# =========================================================


@app.get("/products/{product_id}/image")
async def product_image(request: Request, product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product id")
    product = await request.app.state.products.find_one(
        {"_id": ObjectId(product_id)}, {"image": 1, "image_content_type": 1}
    )
    if not product or not product.get("image"):
        raise HTTPException(status_code=404, detail="Product not found")
    return Response(
        content=bytes(product["image"]),
        media_type=product.get("image_content_type", "image/jpeg"),
        headers={"Cache-Control": "no-cache"},
    )


@app.put("/products/{product_id}")
async def edit_product(
    request: Request,
    product_id: str,
    title: str = Form(..., min_length=1, max_length=200),
    price: float = Form(..., ge=0, allow_inf_nan=False),
    desc: str = Form("", max_length=5000),
    image: UploadFile | None = File(None),
):
    """Save product details and an optional replacement image atomically."""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product id")
    collection = request.app.state.products
    query = {"_id": ObjectId(product_id)}
    if not await collection.find_one(query, {"_id": 1}):
        raise HTTPException(status_code=404, detail="Product not found")
    fields = {"title": title, "price": price, "desc": desc}
    if image is not None:
        image_bytes = await read_and_validate_image(image)
        try:
            embedding = await run_in_threadpool(create_image_embedding, image_bytes)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        fields.update(image=Binary(image_bytes), image_content_type=image.content_type,
                      embedding=embedding, embedding_model=EMBEDDING_MODEL)
    fields["updated_at"] = datetime.now(timezone.utc)
    result = await collection.update_one(query, {"$set": fields})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "product": {"id": product_id, "title": title,
                                         "price": price, "desc": desc}}


@app.delete("/products/{product_id}")
async def delete_product(
    request: Request,
    product_id: str
):

    products_collection = (
        request
        .app
        .state
        .products
    )


    try:

        object_id = ObjectId(
            product_id
        )

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid product id"
        )


    result = await (
        products_collection
        .delete_one(
            {
                "_id":
                    object_id
            }
        )
    )


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    return {

        "success": True,

        "message":
            "Product deleted"

    }

# =========================================================
# UPDATE PRODUCT
# Partial Update
# =========================================================


from pydantic import BaseModel, Field


class ProductUpdate(BaseModel):

    title: str | None = None

    desc: str | None = None

    price: float | None = Field(default=None, ge=0, allow_inf_nan=False)



@app.patch("/products/{product_id}")
async def update_product(

    request: Request,

    product_id: str,

    update_data: ProductUpdate

):


    products_collection = (
        request
        .app
        .state
        .products
    )


    try:

        object_id = ObjectId(
            product_id
        )

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid product id"
        )


    # Remove fields not sent

    update_fields = {

        key:value

        for key,value

        in update_data.model_dump().items()

        if value is not None

    }


    if not update_fields:

        raise HTTPException(

            status_code=400,

            detail="No fields to update"

        )


    result = await (

        products_collection

        .update_one(

            {
                "_id":
                    object_id
            },

            {
                "$set":
                    update_fields
            }

        )

    )


    if result.matched_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Product not found"

        )


    updated_product = await (

        products_collection

        .find_one(

            {
                "_id":
                    object_id
            },

            {
                "embedding":0,
                "image":0
            }

        )

    )


    return {

        "success":True,

        "message":
            "Product updated",

        "product":{

            "id":
                str(
                    updated_product["_id"]
                ),

            "title":
                updated_product.get(
                    "title"
                ),

            "desc":
                updated_product.get(
                    "desc"
                ),

            "price":
                updated_product.get(
                    "price"
                )

        }

    }
