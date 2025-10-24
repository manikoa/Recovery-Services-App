# Supabase Setup Guide

This directory contains SQL scripts for setting up your Supabase database for the Recovery Services App.

## Getting Started

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Note your project URL and API keys (public anon key and service role key)
3. Run the SQL scripts in the Supabase SQL Editor in the following order:

## Setup Order

1. `sql/schema.sql` - Creates the database tables
2. `sql/security.sql` - Sets up Row-Level Security policies
3. `sql/seed.sql` - Populates the database with initial data

## Connecting to Supabase

After setting up your Supabase project:

1. Update the `.env.local` file in the frontend directory with your Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Authentication Setup

1. In the Supabase dashboard, go to Authentication > Settings
2. Configure your site URL and redirect URLs
3. Set up any additional providers (Google, GitHub, etc.) if needed
4. Customize email templates for verification, password reset, etc.

## Storage Setup

If you need to store files (e.g., resource images):

1. In the Supabase dashboard, go to Storage
2. Create a new bucket called `resource-images`
3. Set up appropriate bucket policies

## Edge Functions (Optional)

For custom server-side logic:

1. Install the Supabase CLI
2. Create and deploy edge functions for complex operations
