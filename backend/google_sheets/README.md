# Google Sheets Setup Guide

This directory contains utilities for interacting with Google Sheets for resource management in the Recovery Services App.

## Getting Started

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create a Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details and create it
4. Click on the created service account
5. Go to the "Keys" tab
6. Click "Add Key" > "Create new key"
7. Choose JSON format and download the key file
8. Save this file securely (e.g., `backend/google_sheets/credentials.json`)

### 3. Create a Google Spreadsheet

1. Create a new Google Spreadsheet
2. Share it with the service account email (found in the JSON credentials file, e.g., `your-service-account@project-id.iam.gserviceaccount.com`)
3. Give it "Editor" permissions
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 4. Set Up Spreadsheet Structure

Create the following sheets in your Google Spreadsheet:

#### Resources Sheet
Headers (Row 1):
- id
- name
- slug
- description
- category_id
- category_name
- address
- city
- state
- zip_code
- phone
- email
- website
- hours_of_operation
- eligibility_criteria
- status
- requires_verification
- tags
- created_at
- updated_at

#### Categories Sheet
Headers (Row 1):
- id
- name
- slug
- description

### 5. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
GOOGLE_SERVICE_ACCOUNT_PATH=./google_sheets/credentials.json
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

## Usage

```python
from google_sheets.client import get_resources, get_resource_by_slug, create_resource

# Get all active resources
resources = get_resources()

# Get resources with filters
filtered_resources = get_resources({
    'category': 'food',
    'city': 'Springfield',
    'state': 'IL',
    'status': 'active'
})

# Get a specific resource
resource = get_resource_by_slug('community-food-bank')

# Create a new resource
new_resource = create_resource({
    'name': 'New Resource',
    'slug': 'new-resource',
    'description': 'Description here',
    'city': 'Springfield',
    'state': 'IL',
    'zip_code': '62701',
    'status': 'pending'
})
```

## API Integration

The Google Sheets client can be used with Next.js API routes to provide a REST API for the frontend. See the frontend API routes for examples.

## Notes

- The service account credentials file should be kept secure and never committed to version control
- Add `credentials.json` to `.gitignore`
- The spreadsheet structure should match the expected headers for proper data mapping
- Status values are typically: 'active', 'pending', 'inactive'

