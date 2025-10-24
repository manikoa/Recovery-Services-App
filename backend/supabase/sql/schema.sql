-- This file contains the SQL schema for setting up the Supabase database
-- You can run this in the Supabase SQL editor to create your database schema

-- Resource Categories
CREATE TABLE resource_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES resource_categories(id),
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  hours_of_operation TEXT,
  eligibility_criteria TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  requires_verification BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Resource Tags
CREATE TABLE resource_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Resource-Tag Relationship (Many-to-Many)
CREATE TABLE resource_tag_relations (
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES resource_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- Resource Updates
CREATE TABLE resource_updates (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  updated_fields JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update timestamps
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_resource_categories_updated_at
BEFORE UPDATE ON resource_categories
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();
