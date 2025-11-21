# Recovery Services App - Backend

Python FastAPI server for managing resources stored in Google Sheets.

## Setup

1. **Create virtual environment:**
```bash
python3 -m venv recovery
source recovery/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables in `.env`:**
```env
GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/service-account-key.json
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

## Running the Server

### Development (Recommended)
```bash
# Simple way
python run.py

# Or with custom port
PORT=8001 python run.py
```

### Alternative Methods
```bash
# Direct app.py
python app.py

# Using uvicorn directly
uvicorn app:app --reload --port 8000

# Legacy start script
python start_server.py
```

### Production
```bash
ENVIRONMENT=production python run.py
```

**API Documentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### GET `/api/resources`
Get all resources with optional filters.

**Query Parameters:**
- `category` - Filter by category name
- `city` - Filter by city (partial match)
- `state` - Filter by state
- `status` - Filter by status (default: 'active')
- `query` - Search in name, description, or city

**Example:**
```
GET /api/resources?category=food&city=Springfield&state=IL
```

### GET `/api/resources/<slug>`
Get a single resource by slug or ID.

**Example:**
```
GET /api/resources/community-food-bank
GET /api/resources/123
```

### PATCH `/api/resources/<slug>`
Update a resource by slug or ID.

**Example:**
```
PATCH /api/resources/123
Body: { "name": "Updated Name", "status": "active" }
```

### POST `/api/resources`
Create a new resource.

**Example:**
```
POST /api/resources
Body: {
  "name": "New Resource",
  "slug": "new-resource",
  "description": "Description here",
  "city": "Springfield",
  "state": "IL",
  "zip_code": "62701",
  "status": "pending"
}
```

### GET `/api/categories`
Get all resource categories.

### GET `/health`
Health check endpoint.

## Development

The backend uses FastAPI with CORS enabled to allow the frontend to make requests. All Google Sheets operations are handled through the `google_sheets/client.py` module.

FastAPI provides:
- Automatic API documentation (Swagger UI and ReDoc)
- Type validation with Pydantic
- Async support
- High performance

## Production

For production, use uvicorn with multiple workers:

```bash
uvicorn app:app --host 0.0.0.0 --port 5000 --workers 4
```

Or use a process manager like systemd, supervisor, or Docker.

