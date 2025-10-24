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
│   │   ├── supabase/   # Supabase client and utilities
│   │   └── utils.ts    # Utility functions
│   └── types/          # TypeScript type definitions
└── ...
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: User login and registration with Supabase Auth
- **Resource Discovery**: Search and filter recovery resources
- **Resource Management**: View detailed resource information
- **Provider Portal**: Update resource information (for authenticated providers)

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Supabase](https://supabase.com/) - Backend-as-a-Service