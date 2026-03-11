# Recovery Services App - Frontend

This is the frontend for the Recovery Services App built with Next.js, Tailwind CSS, and shadcn/ui.

## Project Structure

```
frontend/
├── public/
│   └── icons/          # SVG icons
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Layout components (header, footer)
│   │   ├── resources/  # Resource display components
│   │   └── ui/         # UI components (shadcn/ui)
│   ├── hooks/          # Custom React hooks
│   ├── lib/
│   │   ├── api/        # API client functions
│   │   ├── google-sheets/  # Google Sheets server-side utilities
│   │   └── utils.ts    # Utility functions
│   └── types/          # TypeScript type definitions
└── ...
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your Google Sheets credentials:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Resource Discovery**: Search and filter recovery resources
- **Resource Management**: View detailed resource information
- **Provider Portal**: Update resource information (for authenticated providers)
- **Google Sheets Integration**: Resources stored and managed via Google Spreadsheets

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Google Sheets API](https://developers.google.com/sheets/api) - Backend data storage