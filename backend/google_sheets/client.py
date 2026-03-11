"""
Google Sheets Client
Utility functions for interacting with Google Sheets for resource management.
"""

import os
import json
import tempfile
from typing import List, Dict, Optional, Any
from google.oauth2.service_account import Credentials as ServiceAccountCredentials
from google.oauth2.credentials import Credentials as UserCredentials
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import sys

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config

def get_google_sheets_service():
    """
    Returns a Google Sheets service instance.
    
    Credential priority:
        1. GOOGLE_CREDENTIALS_JSON env var (for Render/production deployments)
        2. Service account key file (if GOOGLE_SERVICE_ACCOUNT_PATH is set)
        3. Application Default Credentials (for local dev via gcloud)
    
    Returns:
        tuple: A tuple containing (service, spreadsheet_id) where:
            - service: A configured Google Sheets API service
            - spreadsheet_id: The ID of the Google Spreadsheet
    """
    spreadsheet_id = Config.GOOGLE_SPREADSHEET_ID
    
    if not spreadsheet_id:
        raise ValueError("GOOGLE_SPREADSHEET_ID must be set in environment variables")
    
    creds_json = os.getenv('GOOGLE_CREDENTIALS_JSON')
    creds_path = Config.GOOGLE_SERVICE_ACCOUNT_PATH
    
    if creds_json:
        # Priority 1: JSON credentials from environment variable (Render/production)
        creds_data = json.loads(creds_json)
        if creds_data.get('type') == 'service_account':
            creds = ServiceAccountCredentials.from_service_account_info(creds_data, scopes=Config.SCOPES)
        elif creds_data.get('type') == 'authorized_user':
            creds = UserCredentials.from_authorized_user_info(creds_data, scopes=Config.SCOPES)
        else:
            raise ValueError(f"Unsupported credential type: {creds_data.get('type')}")
    elif creds_path and os.path.exists(creds_path):
        # Priority 2: Service account key file
        creds = ServiceAccountCredentials.from_service_account_file(creds_path, scopes=Config.SCOPES)
    else:
        # Priority 3: Application Default Credentials (local dev)
        creds, _ = google.auth.default(scopes=Config.SCOPES)
    
    service = build('sheets', 'v4', credentials=creds)
    
    return service, spreadsheet_id

def get_resources(filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Get resources from Google Sheets with optional filters.
    
    Args:
        filters: Dictionary of filters to apply (category, city, state, status, query)
                 - category: Filter by category name (exact match)
                 - city: Filter by city (partial match)
                 - state: Filter by state (exact match, case-insensitive)
                 - status: Filter by status (exact match, case-insensitive)
                 - query: Search query that searches across name, description, category,
                          address, city, state, and tags (partial match, case-insensitive)
        
    Returns:
        List of resources as dictionaries. Each dictionary includes a hidden '_row' key
        indicating the source row number (1-based) in the spreadsheet.
    """
    try:
        service, spreadsheet_id = get_google_sheets_service()
        
        # Read from the Resources sheet
        range_name = Config.SHEETS['RESOURCES']
        
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            return []
        
        # Get headers from Config
        headers = Config.RESOURCE_HEADERS
        
        resources = []
        # Use enumerate to track the original row index from the API response
        # The API request started at A2, so index 0 is row 2.
        for idx, row in enumerate(values):
            if len(row) < len(headers):
                # Pad row with empty strings if needed
                row.extend([''] * (len(headers) - len(row)))
            
            resource = dict(zip(headers, row[:len(headers)]))
            
            # Store the actual row number (1-based) for updates
            resource['_row'] = idx + 2
            
            # Convert string values to appropriate types
            resource['id'] = int(resource.get('id', 0)) if str(resource.get('id', '')).isdigit() else 0
            # category_id is not in sheet, default to 0
            resource['category_id'] = 0 
            
            # Map keys to expected API format
            resource['description'] = resource.get('sheet_description', '')
            
            # Derive a short category name from primary_services or organization_type
            # expecting comma separated values
            primary = resource.get('primary_services', '')
            if primary:
                resource['category_name'] = primary.split(',')[0].strip()
            else:
                resource['category_name'] = resource.get('organization_type', 'Uncategorized')
            
            # Simple address parsing (very basic)
            full_address = resource.get('address', '')
            resource['city'] = ''
            resource['state'] = ''
            resource['zip_code'] = ''
            
            if full_address:
                parts = full_address.split(',')
                if len(parts) >= 3:
                     # Attempt to parse "Street, City, WA Zip"
                     try:
                         resource['city'] = parts[-2].strip()
                         state_zip = parts[-1].strip().split(' ')
                         if len(state_zip) >= 2:
                             resource['state'] = state_zip[0]
                             resource['zip_code'] = state_zip[1]
                     except:
                         pass

            # Combine tags and keywords
            tags_list = []
            if resource.get('tags'):
                tags_list.extend([t.strip() for t in resource['tags'].split(',')])
            if resource.get('keywords'):
                tags_list.extend([t.strip() for t in resource['keywords'].split(',')])
            resource['tags'] = tags_list

            # Skip resources with invalid IDs
            if resource['id'] == 0:
                continue
            
            if filters and 'status' in filters:
                # If status filter is explicitly set, apply it strictly
                # If status is None, it means "all statuses" (don't filter)
                if filters['status'] is not None and resource.get('status', '').lower() != filters['status'].lower():
                    continue
            else:
                # Default behavior: show active and pending resources (exclude inactive/archived)
                resource_status = resource.get('status', '').lower()
                if resource_status not in ['active', 'pending']:
                    continue
            
            # Apply other filters (only if filters dict is provided)
            if filters:
                if 'category' in filters and resource.get('category_name', '').lower() != filters['category'].lower():
                    continue
                if 'city' in filters and filters['city'].lower() not in resource.get('city', '').lower():
                    continue
                if 'state' in filters and resource.get('state', '').upper() != filters['state'].upper():
                    continue
                if 'query' in filters:
                    # Search across multiple fields
                    query = filters['query'].lower().strip()
                    if query:
                        searchable_fields = [
                            resource.get('name', ''),
                            resource.get('description', ''),
                            resource.get('category_name', ''),
                            resource.get('address', ''),
                            resource.get('city', ''),
                            resource.get('state', ''),
                            resource.get('tags', ''),
                        ]
                        # Check if query matches any field
                        matches = any(query in str(field).lower() for field in searchable_fields if field)
                        if not matches:
                            continue
            
            resources.append(resource)
        
        return resources
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return []

def get_resource_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """
    Get a resource by its slug.
    
    Args:
        slug: The resource slug
        
    Returns:
        Resource data as dictionary or None if not found
    """
    resources = get_resources()
    
    for resource in resources:
        if resource.get('slug', '').lower() == slug.lower():
            return resource
    
    return None

def get_resource_categories() -> List[Dict[str, Any]]:
    """
    Get all resource categories from Google Sheets.
    
    Returns:
        List of categories as dictionaries
    """
    try:
        service, spreadsheet_id = get_google_sheets_service()
        
        range_name = Config.SHEETS['CATEGORIES']
        
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            return []
        
        headers = ['id', 'name', 'slug', 'description']
        categories = []
        
        for row in values:
            if len(row) < len(headers):
                row.extend([''] * (len(headers) - len(row)))
            
            category = dict(zip(headers, row[:len(headers)]))
            category['id'] = int(category.get('id', 0)) if category.get('id', '').isdigit() else 0
            categories.append(category)
        
        return categories
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return []

def create_resource(resource_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Create a new resource in Google Sheets.
    
    Args:
        resource_data: Dictionary containing resource information
        
    Returns:
        Created resource data or None if failed
    """
    try:
        service, spreadsheet_id = get_google_sheets_service()
        
        # Get the next ID
        existing_resources = get_resources()
        next_id = max([r.get('id', 0) for r in existing_resources], default=0) + 1
        
        # Prepare row data
        row = [
            next_id,
            resource_data.get('name', ''),
            resource_data.get('slug', ''),
            resource_data.get('description', ''),
            resource_data.get('category_id', 0),
            resource_data.get('category_name', ''),
            resource_data.get('address', ''),
            resource_data.get('city', ''),
            resource_data.get('state', ''),
            resource_data.get('zip_code', ''),
            resource_data.get('phone', ''),
            resource_data.get('email', ''),
            resource_data.get('website', ''),
            resource_data.get('hours_of_operation', ''),
            resource_data.get('eligibility_criteria', ''),
            resource_data.get('status', 'pending'),
            str(resource_data.get('requires_verification', True)),
            ','.join(resource_data.get('tags', [])),
            resource_data.get('created_at', ''),
            resource_data.get('updated_at', '')
        ]
        
        
        
        range_name = Config.SHEETS['RESOURCES']
        
        body = {
            'values': [row]
        }
        
        result = service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            insertDataOption='INSERT_ROWS',
            body=body
        ).execute()
        
        resource_data['id'] = next_id
        return resource_data
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

def update_resource(resource_id: int, updates: Dict[str, Any]) -> bool:
    """
    Update a resource in Google Sheets.
    
    Args:
        resource_id: The ID of the resource to update
        updates: Dictionary containing fields to update
        
    Returns:
        True if successful, False otherwise
    """
    try:
        service, spreadsheet_id = get_google_sheets_service()
        
        # Get all resources to find the correct row index
        # We need ALL resources to ensure we find the ID even if status is not active
        resources = get_resources({'status': None})
        
        target_resource = None
        for r in resources:
            if r.get('id') == resource_id:
                target_resource = r
                break
        
        if not target_resource or '_row' not in target_resource:
            return False
            
        row_index = target_resource['_row']
        
        # Map updates to column indices (A=0, B=1, etc.)
        row_index = target_resource['_row']
        
        # Map updates to column indices (A=0, B=1, etc.)
        column_map = Config.RESOURCE_COLUMN_MAP
        
        # Prepare batch update data
        data = []
        for field, value in updates.items():
            if field in column_map:
                col_letter = chr(65 + column_map[field])  # Convert to A, B, C, etc.
                range_name = f'Resources!{col_letter}{row_index}'
                data.append({
                    'range': range_name,
                    'values': [[str(value)]]
                })
        
        if not data:
            return True  # No valid fields to update
            
        body = {
            'valueInputOption': 'RAW',
            'data': data
        }
        
        service.spreadsheets().values().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body=body
        ).execute()
        
        return True
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return False

