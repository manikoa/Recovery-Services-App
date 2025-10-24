-- This file contains seed data to populate the Supabase database with initial values
-- Run this after setting up the schema and security policies

-- Insert Resource Categories
INSERT INTO resource_categories (name, slug, description, icon) VALUES
('Food Assistance', 'food-assistance', 'Food banks, meal programs, and nutrition services', 'utensils'),
('Addiction Recovery', 'addiction-recovery', 'Support groups, treatment centers, and recovery programs', 'heart-pulse'),
('Housing', 'housing', 'Emergency shelters, transitional housing, and rental assistance', 'home'),
('Healthcare', 'healthcare', 'Medical services, mental health support, and counseling', 'stethoscope'),
('Employment', 'employment', 'Job training, career counseling, and employment opportunities', 'briefcase'),
('Education', 'education', 'Educational resources, tutoring, and scholarship information', 'graduation-cap'),
('Transportation', 'transportation', 'Public transit assistance, ride services, and vehicle programs', 'bus');

-- Insert Resource Tags
INSERT INTO resource_tags (name, slug) VALUES
('Emergency', 'emergency'),
('Free', 'free'),
('Low-Cost', 'low-cost'),
('Walk-In', 'walk-in'),
('Appointment Required', 'appointment-required'),
('Family-Friendly', 'family-friendly'),
('Youth Services', 'youth-services'),
('Senior Services', 'senior-services'),
('Disability Services', 'disability-services'),
('LGBTQ+ Friendly', 'lgbtq-friendly'),
('Multilingual', 'multilingual');

-- Note: Resources would typically be added by users through the application
-- This is just an example of how you might add some initial resources

-- Example Resource (you would need to replace 'user-id' with an actual user ID)
/*
INSERT INTO resources (
  name, 
  slug, 
  description, 
  category_id, 
  address, 
  city, 
  state, 
  zip_code, 
  phone, 
  email, 
  website, 
  hours_of_operation, 
  eligibility_criteria, 
  status, 
  created_by
) VALUES (
  'Community Food Bank', 
  'community-food-bank', 
  'Provides free groceries and meals to individuals and families in need.', 
  (SELECT id FROM resource_categories WHERE slug = 'food-assistance'), 
  '123 Main Street', 
  'Springfield', 
  'IL', 
  '62701', 
  '555-123-4567', 
  'info@communityfoodbank.org', 
  'https://www.communityfoodbank.org', 
  'Monday-Friday: 9am-5pm, Saturday: 10am-2pm', 
  'Open to all residents. Please bring ID and proof of address.', 
  'active', 
  'user-id'
);
*/
