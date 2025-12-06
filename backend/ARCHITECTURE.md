# Backend Architecture Flow

## Overview
The Recovery Services App backend is built with FastAPI and uses Google Sheets as the data storage layer. This document outlines the complete architecture flow from client requests to data persistence.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                            │
│                    (Next.js - React Application)                     │
└──────────────────────────────┬──────────────────────────────────────┘
                                │
                                │ HTTP Requests (REST API)
                                │ GET /api/resources
                                │ POST /api/resources
                                │ PATCH /api/resources/{slug}
                                │ GET /api/categories
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FASTAPI APPLICATION LAYER                        │
│                         (app.py)                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE LAYER                           │  │
│  │  • CORS Middleware (Cross-Origin Resource Sharing)          │  │
│  │  • Request/Response Processing                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ROUTE HANDLERS                            │  │
│  │                                                               │  │
│  │  GET    /api/resources          → list_resources()           │  │
│  │  POST   /api/resources          → create_resource_endpoint() │  │
│  │  GET    /api/resources/{slug}    → get_resource()            │  │
│  │  PATCH  /api/resources/{slug}    → update_resource_endpoint()│  │
│  │  GET    /api/categories          → list_categories()         │  │
│  │  GET    /health                  → health_check()            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  PYDANTIC VALIDATION                          │  │
│  │  • ResourceCreate Model (POST requests)                      │  │
│  │  • ResourceUpdate Model (PATCH requests)                    │  │
│  │  • Automatic type validation & conversion                    │  │
│  │  • Error handling for invalid data                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ERROR HANDLING                             │  │
│  │  • HTTPException for API errors                              │  │
│  │  • Status codes: 400, 404, 500                              │  │
│  │  • Error messages returned to client                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               │ Function Calls
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  GOOGLE SHEETS CLIENT LAYER                         │
│                   (google_sheets/client.py)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              AUTHENTICATION & SERVICE SETUP                    │  │
│  │  get_google_sheets_service()                                  │  │
│  │  • Loads service account credentials                         │  │
│  │  • Authenticates with Google Sheets API                       │  │
│  │  • Returns configured service instance                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DATA OPERATIONS                            │  │
│  │                                                               │  │
│  │  get_resources(filters)                                       │  │
│  │  • Reads from 'Resources' sheet                              │  │
│  │  • Applies filters (category, city, state, status, query)    │  │
│  │  • Converts rows to dictionaries                             │  │
│  │  • Returns list of resources                                 │  │
│  │                                                               │  │
│  │  get_resource_by_slug(slug)                                  │  │
│  │  • Finds resource by slug                                    │  │
│  │  • Returns single resource or None                           │  │
│  │                                                               │  │
│  │  get_resource_categories()                                    │  │
│  │  • Reads from 'Categories' sheet                             │  │
│  │  • Returns list of categories                                │  │
│  │                                                               │  │
│  │  create_resource(resource_data)                               │  │
│  │  • Generates next ID                                         │  │
│  │  • Appends new row to 'Resources' sheet                      │  │
│  │  • Returns created resource                                  │  │
│  │                                                               │  │
│  │  update_resource(resource_id, updates)                       │  │
│  │  • Finds resource by ID                                      │  │
│  │  • Updates specific cells in Google Sheets                   │  │
│  │  • Returns success status                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               │ Google Sheets API Calls
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS API                                 │
│              (Google Cloud Platform)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    SPREADSHEET                                 │  │
│  │                                                               │  │
│  │  Sheet: Resources                                             │  │
│  │  Columns: id, name, slug, description, category_id,           │  │
│  │           category_name, address, city, state, zip_code,     │  │
│  │           phone, email, website, hours_of_operation,         │  │
│  │           eligibility_criteria, status,                      │  │
│  │           requires_verification, tags, created_at, updated_at│  │
│  │                                                               │  │
│  │  Sheet: Categories                                            │  │
│  │  Columns: id, name, slug, description                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: GET /api/resources

### Step-by-Step Flow

1. **Client Request**
   - Frontend sends HTTP GET request to `/api/resources?category=food&city=Springfield`
   - Request includes query parameters for filtering

2. **CORS Middleware**
   - FastAPI CORS middleware processes the request
   - Validates origin and allows cross-origin requests

3. **Route Handler**
   - `list_resources()` function is invoked
   - Query parameters are extracted:
     - `category`: "food"
     - `city`: "Springfield"
     - `state`: None
     - `status`: None
     - `query`: None

4. **Filter Processing**
   - Query parameters are converted to a filters dictionary:
     ```python
     filters = {
         'category': 'food',
         'city': 'Springfield'
     }
     ```

5. **Google Sheets Client Call**
   - `get_resources(filters)` is called
   - `get_google_sheets_service()` authenticates and creates service instance
   - Service account credentials are loaded from environment

6. **Google Sheets API Request**
   - API call to read `Resources!A2:Z` range
   - All rows are retrieved from the spreadsheet

7. **Data Processing**
   - Rows are converted to dictionaries with headers
   - Type conversions applied (strings to integers, booleans)
   - Filters are applied:
     - Status filter: Only 'active' or 'pending' resources
     - Category filter: Exact match on category_name
     - City filter: Partial match on city field
   - Invalid resources (ID = 0) are skipped

8. **Response Formation**
   - Filtered resources are returned as a list
   - Wrapped in response format: `{"data": resources}`
   - HTTP 200 status code

9. **Client Receives Response**
   - Frontend receives JSON response
   - Resources are displayed in the UI

## Request Flow Example: POST /api/resources

### Step-by-Step Flow

1. **Client Request**
   - Frontend sends HTTP POST request to `/api/resources`
   - Request body contains resource data (JSON)

2. **Pydantic Validation**
   - `ResourceCreate` model validates the request body
   - Checks required fields: name, slug, description, category_id, city, state, zip_code
   - Validates data types and formats
   - If validation fails → HTTP 422 error returned

3. **Route Handler**
   - `create_resource_endpoint()` function is invoked
   - Validated data is converted to dictionary via `model_dump()`

4. **Google Sheets Client Call**
   - `create_resource(resource_data)` is called
   - Function generates next ID by finding max existing ID + 1
   - Prepares row data array matching spreadsheet columns

5. **Google Sheets API Request**
   - API call to append row to `Resources!A2:Z`
   - New row is inserted into the spreadsheet

6. **Response Formation**
   - Created resource data is returned
   - Wrapped in response format: `{"data": created_resource}`
   - HTTP 201 status code

7. **Client Receives Response**
   - Frontend receives confirmation with created resource data

## Request Flow Example: PATCH /api/resources/{slug}

### Step-by-Step Flow

1. **Client Request**
   - Frontend sends HTTP PATCH request to `/api/resources/community-food-bank`
   - Request body contains only fields to update (JSON)

2. **Pydantic Validation**
   - `ResourceUpdate` model validates the request body
   - All fields are optional
   - Validates data types for provided fields

3. **Route Handler**
   - `update_resource_endpoint()` function is invoked
   - Slug is extracted from URL path
   - Updates dictionary is created (excluding None values)

4. **Resource Lookup**
   - If slug is numeric → treated as ID
   - If slug is string → `get_resource_by_slug()` finds resource
   - Resource ID is extracted for update operation

5. **Google Sheets Client Call**
   - `update_resource(resource_id, updates)` is called
   - Function finds the row index by searching all resources
   - Maps field names to column indices (A=0, B=1, etc.)

6. **Google Sheets API Request**
   - Multiple API calls to update specific cells
   - Each field update is a separate API call to specific cell range
   - Example: `Resources!B5` for name, `Resources!C5` for slug, etc.

7. **Response Formation**
   - Success status is returned: `{"success": True}`
   - HTTP 200 status code

8. **Client Receives Response**
   - Frontend receives confirmation of successful update

## Component Responsibilities

### app.py (FastAPI Application)
- **Purpose**: Main application entry point and API layer
- **Responsibilities**:
  - Define REST API endpoints
  - Request/response validation with Pydantic
  - Error handling and HTTP status codes
  - CORS configuration
  - Route registration

### google_sheets/client.py (Data Access Layer)
- **Purpose**: Abstraction layer for Google Sheets operations
- **Responsibilities**:
  - Google Sheets API authentication
  - Data retrieval operations
  - Data creation operations
  - Data update operations
  - Filtering and data transformation
  - Error handling for API failures

### run.py (Server Runner)
- **Purpose**: Production-ready server configuration
- **Responsibilities**:
  - Uvicorn server configuration
  - Environment-based settings (dev/prod)
  - Port and host configuration
  - Hot reload for development

## Data Flow Patterns

### Read Operations (GET)
```
Client → FastAPI Route → Google Sheets Client → Google Sheets API → Spreadsheet
                                                      ↓
Client ← JSON Response ← Filtered Data ← Raw Rows ← Spreadsheet
```

### Write Operations (POST/PATCH)
```
Client → FastAPI Route → Validation → Google Sheets Client → Google Sheets API → Spreadsheet
                                                      ↓
Client ← JSON Response ← Success Status ← API Response ← Spreadsheet
```

## Error Handling Flow

```
Request → Validation Error → HTTPException (422) → Client
Request → Not Found → HTTPException (404) → Client
Request → Google Sheets API Error → HTTPException (500) → Client
Request → General Exception → HTTPException (500) → Client
```

## Environment Configuration

### Required Environment Variables
- `GOOGLE_SERVICE_ACCOUNT_PATH`: Path to service account JSON file
- `GOOGLE_SPREADSHEET_ID`: Google Spreadsheet ID
- `PORT`: Server port (default: 8001)
- `HOST`: Server host (default: 127.0.0.1)
- `ENVIRONMENT`: "production" or development (default: dev)

## Key Design Decisions

1. **Google Sheets as Database**
   - No traditional database setup required
   - Easy for non-technical users to view/edit data
   - Built-in version history and collaboration

2. **Service Account Authentication**
   - No user authentication required for API access
   - Secure credential management via service account JSON

3. **Pydantic Models for Validation**
   - Type safety at API boundary
   - Automatic request/response validation
   - Clear error messages for invalid data

4. **Async/Await Support**
   - FastAPI's async capabilities for better performance
   - Non-blocking I/O operations

5. **Filtering in Application Layer**
   - Filters applied after data retrieval
   - Simple implementation, but may not scale for very large datasets
   - Could be optimized with Google Sheets query functions if needed

## Performance Considerations

- **Caching**: Currently no caching layer - all requests hit Google Sheets API
- **Rate Limiting**: Google Sheets API has rate limits (should be monitored)
- **Batch Operations**: Updates are done cell-by-cell (could be optimized with batch updates)
- **Pagination**: Currently returns all resources (could add pagination for large datasets)

## Security Considerations

- **CORS**: Currently allows all origins (`allow_origins=["*"]`) - should be restricted in production
- **Authentication**: No API authentication layer (consider adding API keys or JWT tokens)
- **Service Account**: Credentials stored in file system (should be secured in production)
- **Input Validation**: Pydantic models provide validation, but additional sanitization may be needed

