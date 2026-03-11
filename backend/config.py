
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Server Settings
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 8001))
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
    # CORS Settings
    CORS_ORIGINS = ["*"]  # Set specific origins in production
    
    # Google Sheets Settings
    GOOGLE_SERVICE_ACCOUNT_PATH = os.getenv('GOOGLE_SERVICE_ACCOUNT_PATH')
    GOOGLE_SPREADSHEET_ID = os.getenv('GOOGLE_SPREADSHEET_ID')
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    
    # Sheet Ranges and Names
    SHEETS = {
        'RESOURCES': 'Resources!A2:Z',
        'CATEGORIES': 'Categories!A2:D'
    }
    
    # Resource Column Mapping (0-based index from A)
    # This maps the internal field name to the column index in the sheet
    RESOURCE_COLUMN_MAP = {
        'id': 0,
        'name': 1,
        'slug': 2,
        'category_name': 3,
        'address': 4,
        'phone': 5,
        'email': 6,
        'website': 7,
        'eligibility_criteria': 8,
        'population_served': 9,
        'hours_of_operation': 10,
        'status': 11,
        'languages': 12,
        'accessibility': 13,
        'organization_type': 14,
        'primary_services': 15,
        'secondary_services': 16,
        'tags': 17,
        'notes': 18,
        'last_updated': 19,
        'verified_by': 20,
        'verification_date': 21,
        'keywords': 22,
        'cost': 23
    }

    # Resource Headers (for reading)
    RESOURCE_HEADERS = [
        'id', 'name', 'slug', 'sheet_description', 'address', 'phone', 'email', 'website',
        'eligibility_criteria', 'population_served', 'hours_of_operation', 'status',
        'languages', 'accessibility', 'organization_type', 'primary_services', 
        'secondary_services', 'tags', 'notes', 'last_updated', 'verified_by', 
        'verification_date', 'keywords', 'cost'
    ]
