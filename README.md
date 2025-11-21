# Recovery Services App

A web application for the Community Change Team that helps people with resource recovery. The platform connects individuals in need with essential recovery resources and services.

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components built with Radix UI and Tailwind CSS

### Backend
- [Google Sheets API](https://developers.google.com/sheets/api) - Google Spreadsheets for resource data management

## Getting Started

### Prerequisites
- Python (v3.8 or later) - Required for backend API
- Node.js (v18 or later) - Required for frontend (Next.js)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/Recovery-Services-App.git
cd Recovery-Services-App
```

2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables

**Backend (`.env` in backend directory):**
```
GOOGLE_SERVICE_ACCOUNT_PATH=./google_sheets/credentials.json
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

**Frontend (`.env.local` in frontend directory):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Set up Google Sheets
- Follow the instructions in `backend/google_sheets/README.md` to set up your Google Sheets integration
- Create a Google Spreadsheet with the required structure

## Development

### Running the backend
```bash
cd backend
python app.py
```
The API will be available at `http://localhost:5000`

### Running the frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

## Target Users

- Individuals looking for assistance including food, addiction recovery, and other support services
- Friends and family of people on substance addiction recovery journeys
- Different organizations looking to update their resource information
- The Community Change Team members directing people to available resources

## Core Features

### User Experience
- **Simplicity and Usability**: Intuitive design that prevents user frustration when searching for resources
- **Accessible Interface**: Designed for users of all technical abilities and backgrounds

### Resource Management
- **Essential Filtering/Sorting**: Advanced filtering and sorting capabilities to make resources easier to find
- **Resource Discovery**: Intelligent matching of users with appropriate resources based on their needs
- **Resource Updates**: Ability to add, remove, or modify resources to maintain accuracy and relevance

### Resource Update Workflow
The application includes a streamlined process for resource providers to update their information:
1. Open website and access admin section
2. Select user admin login
3. Enter password or complete verification
4. View current data on their resource
5. Select what information to update
6. Update and submit changes

### Administration
- Resource data stored in Google Spreadsheets
- API routes for resource management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the terms of the license included in the [LICENSE](LICENSE) file.

## Acknowledgments

- Community Change Team
- All contributors and supporters