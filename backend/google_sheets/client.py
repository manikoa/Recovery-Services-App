"""
Google Sheets Client
Utility functions for interacting with Google Sheets for resource management.
"""

import os
from typing import List, Dict, Optional, Any
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Google Sheets API scope
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_google_sheets_service():
    """
    Returns a Google Sheets service instance using service account credentials.
       jkjkkjjk
    Returns:
        Resource: A configured Google Sheets API service
    """
    creds_path = os.getenv('GOOGLE_SERVICE_ACCOUNT_PATH')
    spreadsheet_id = os.getenv('GOOGLE_SPREADSHEET_ID')
    
    if not creds_path:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT_PATH must be set in environment variables")
    if not spreadsheet_id:
        raise ValueError("GOOGLE_SPREADSHEET_ID must be set in environment variables")
    
    creds = Credentials.from_service_account_file(creds_path, scopes=SCOPES)
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
        List of resources as dictionaries
    """
    try:
        service, spreadsheet_id = get_google_sheets_service()
        
        # Read from the Resources sheet (assuming first sheet or named "Resources")
        range_name = 'Resources!A2:Z'  # Skip header row
        
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            return []
        
        # Get headers from first row (or define them)
        headers = [
            'id', 'name', 'slug', 'description', 'category_id', 'category_name',
            'address', 'city', 'state', 'zip_code', 'phone', 'email', 'website',
            'hours_of_operation', 'eligibility_criteria', 'status',
            'requires_verification', 'tags', 'created_at', 'updated_at'
        ]
        
        resources = []
        for row in values:
            if len(row) < len(headers):
                # Pad row with empty strings if needed
                row.extend([''] * (len(headers) - len(row)))
            
            resource = dict(zip(headers, row[:len(headers)]))
            
            # Convert string values to appropriate types
            resource['id'] = int(resource.get('id', 0)) if resource.get('id', '').isdigit() else 0
            resource['category_id'] = int(resource.get('category_id', 0)) if resource.get('category_id', '').isdigit() else 0
            resource['requires_verification'] = resource.get('requires_verification', '').lower() == 'true'
            
            # Apply filters
            if filters:
                if 'category' in filters and resource.get('category_name', '').lower() != filters['category'].lower():
                    continue
                if 'city' in filters and filters['city'].lower() not in resource.get('city', '').lower():
                    continue
                if 'state' in filters and resource.get('state', '').upper() != filters['state'].upper():
                    continue
                if 'status' in filters and resource.get('status', '').lower() != filters['status'].lower():
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
            else:
                # Default to active resources
                if resource.get('status', '').lower() != 'active':
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
        
        range_name = 'Categories!A2:D'  # Assuming Categories sheet exists
        
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
        
        range_name = 'Resources!A2:Z'
        
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
        
        # Get all resources to find the row
        resources = get_resources({'status': None})  # Get all including inactive
        row_index = None
        
        for idx, resource in enumerate(resources):
            if resource.get('id') == resource_id:
                row_index = idx + 2  # +2 because we skip header and 0-indexed
                break
        
        if row_index is None:
            return False
        
        # Map updates to column indices (A=0, B=1, etc.)
        column_map = {
            'name': 1,
            'slug': 2,
            'description': 3,
            'category_id': 4,
            'category_name': 5,
            'address': 6,
            'city': 7,
            'state': 8,
            'zip_code': 9,
            'phone': 10,
            'email': 11,
            'website': 12,
            'hours_of_operation': 13,
            'eligibility_criteria': 14,
            'status': 15,
            'requires_verification': 16,
            'tags': 17,
            'updated_at': 19
        }
        
        # Prepare update requests
        update_requests = []
        for field, value in updates.items():
            if field in column_map:
                col_letter = chr(65 + column_map[field])  # Convert to A, B, C, etc.
                range_name = f'Resources!{col_letter}{row_index}'
                
                body = {
                    'values': [[str(value)]]
                }
                
                service.spreadsheets().values().update(
                    spreadsheetId=spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body=body
                ).execute()
        
        return True
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return False

