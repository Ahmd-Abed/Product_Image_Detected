# Basra - product visual search

Responsive Arabic/English web UI served by the existing FastAPI application. Arabic and RTL are the default; a language selection is remembered on the device.

## Run locally (PowerShell)

```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000**. Keep the existing `.env` with `MONGODB_URI`; optional settings are `MONGODB_DB`, `MATCH_THRESHOLD`, and `MAX_IMAGE_MB` (default 5). Startup connects to MongoDB; image matching uses a lightweight local image fingerprint so the app can run on small Render instances.

The UI includes camera capture and file upload, image scanning while recognition runs, a match/no-match dialog, server-side product search and pagination (5 by default), desktop tables, mobile cards, and add/edit/delete dialogs. Product image replacements update their image fingerprints in the same database write. Prices use the stored numeric value; no currency is assumed.

For phone testing, open the machine's LAN address on port 8000. Live browser camera access requires **HTTPS** (or localhost on the same device). On a plain HTTP LAN address, use the **Use device camera** option or file upload. On supported mobile browsers the capture input opens the native camera. Camera permissions and physical device behavior need testing on the target phone.

## Files and API

- `static/index.html`, `static/styles.css`, `static/app.js`: frontend, no JavaScript build step.
- `GET /`: frontend; `GET /app-config`: image limit.
- Existing `POST /addProduct` and `POST /getProductByImage` remain in use.
- `GET /products?search=...&page=1&page_size=5`: literal case-insensitive title/description search, stable newest-first ordering, sizes capped at 100.
- `GET /products/{id}/image`: stored product photo.
- `PUT /products/{id}`: multipart title, price, description, and optional replacement image.
- Existing `PATCH /products/{id}` and `DELETE /products/{id}` remain available.

Fonts load from Google Fonts when available, with local sans-serif fallbacks. Icons and decorative graphics are local SVG/CSS. The existing API has no authentication; deploy privately or add authentication before exposing product management publicly.

## Backend checks

```powershell
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.venv\Scripts\python.exe -m unittest discover -s tests -v
node --check static/app.js
```

Backend tests substitute an in-memory product collection and an embedding function, without accessing or changing the configured database.

Optional UI interaction checks: `npm install` then `npm test`. These use a simulated DOM and mocked API to check both languages, CRUD, uploads, scanning, pagination, errors, and camera cleanup. They do not verify visual layout or physical camera hardware. Node is only needed for these tests, not to run the app.
