"""
FastAPI Server for Recovery Services App
Provides REST API endpoints for resource management using Google Sheets
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
try:
    from google_sheets.client import (
        get_resources,
        get_resource_by_slug,
        get_resource_categories,
        create_resource,
        update_resource
    )
except ImportError:
    # Handle import error gracefully
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from google_sheets.client import (
        get_resources,
        get_resource_by_slug,
        get_resource_categories,
        create_resource,
        update_resource
    )

app = FastAPI(title="Recovery Services API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ResourceCreate(BaseModel):
    name: str
    slug: str
    description: str
    category_id: int
    category_name: Optional[str] = None
    address: Optional[str] = None
    city: str
    state: str
    zip_code: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    hours_of_operation: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    status: str = "pending"
    requires_verification: bool = True
    tags: Optional[List[str]] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    hours_of_operation: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    status: Optional[str] = None
    requires_verification: Optional[bool] = None
    tags: Optional[List[str]] = None

@app.get("/api/resources")
async def list_resources(
    category: Optional[str] = Query(None, description="Filter by category name"),
    city: Optional[str] = Query(None, description="Filter by city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    status: Optional[str] = Query(None, description="Filter by status"),
    query: Optional[str] = Query(None, description="Search query")
):
    """Get all resources with optional filters"""
    try:
        filters: Dict[str, Any] = {}
        
        if category:
            filters['category'] = category
        if city:
            filters['city'] = city
        if state:
            filters['state'] = state
        if status:
            filters['status'] = status
        if query:
            filters['query'] = query
        
        resources = get_resources(filters)
        return {"data": resources}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resources: {str(e)}")

@app.post("/api/resources", status_code=201)
async def create_resource_endpoint(resource: ResourceCreate):
    """Create a new resource"""
    try:
        resource_data = resource.model_dump()
        created_resource = create_resource(resource_data)
        
        if not created_resource:
            raise HTTPException(status_code=500, detail="Failed to create resource")
        
        return {"data": created_resource}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create resource: {str(e)}")

@app.get("/api/resources/{slug}")
async def get_resource(slug: str):
    """Get a single resource by slug or ID"""
    try:
        # Check if slug is numeric (ID) or string (slug)
        try:
            resource_id = int(slug)
            # If it's a number, get all resources and find by ID
            resources = get_resources({'status': None})  # Get all including inactive
            resource = next((r for r in resources if r.get('id') == resource_id), None)
        except ValueError:
            # It's a slug
            resource = get_resource_by_slug(slug)
        
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        return {"data": resource}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resource: {str(e)}")

@app.patch("/api/resources/{slug}")
async def update_resource_endpoint(slug: str, updates: ResourceUpdate):
    """Update a resource by slug or ID"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_dict = {k: v for k, v in updates.model_dump().items() if v is not None}
        
        # Check if slug is numeric (ID) or string (slug)
        try:
            resource_id = int(slug)
        except ValueError:
            # It's a slug, get the resource first to find its ID
            resource = get_resource_by_slug(slug)
            if not resource:
                raise HTTPException(status_code=404, detail="Resource not found")
            resource_id = resource.get('id')
        
        success = update_resource(resource_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update resource")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update resource: {str(e)}")

@app.get("/api/categories")
async def list_categories():
    """Get all resource categories"""
    try:
        categories = get_resource_categories()
        return {"data": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == '__main__':
    import uvicorn
    import os
    
    # Get port from environment or use default
    port = int(os.getenv('PORT', 8001))
    
    print("Starting Recovery Services API...")
    print(f"Server: http://127.0.0.1:{port}")
    print(f"API Docs: http://127.0.0.1:{port}/docs")
    print("Hot reload enabled")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "app:app",
            host="127.0.0.1",
            port=port,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"Failed to start server: {e}")
        if "Address already in use" in str(e):
            print(f"Port {port} is busy. Try: PORT=5001 python app.py")

