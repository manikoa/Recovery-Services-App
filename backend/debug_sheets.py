
import sys
import os
from dotenv import load_dotenv

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

load_dotenv()

try:
    from google_sheets.client import get_resources
    print("Successfully imported get_resources")
    
    print(f"GOOGLE_SERVICE_ACCOUNT_PATH: {os.getenv('GOOGLE_SERVICE_ACCOUNT_PATH')}")
    print(f"GOOGLE_SPREADSHEET_ID: {os.getenv('GOOGLE_SPREADSHEET_ID')}")
    
    # Try to fetch
    print("Attempting to fetch resources...")
    resources = get_resources()
    print(f"Fetched {len(resources)} resources.")
    print(resources)
    
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
