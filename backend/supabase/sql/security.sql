-- This file contains the Row-Level Security (RLS) policies for the Supabase database
-- Run this after creating the schema to set up proper security

-- Enable RLS on tables
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_updates ENABLE ROW LEVEL SECURITY;

-- Resource Categories: anyone can read, only authenticated users can create/update
CREATE POLICY "Anyone can read resource categories" 
ON resource_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create resource categories" 
ON resource_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resource categories" 
ON resource_categories FOR UPDATE USING (auth.role() = 'authenticated');

-- Resources: anyone can read active resources, only authenticated users can create/update
CREATE POLICY "Anyone can read active resources" 
ON resources FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create resources" 
ON resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own resources" 
ON resources FOR UPDATE USING (auth.uid() = created_by);

-- Resource Tags: anyone can read, only authenticated users can create
CREATE POLICY "Anyone can read resource tags" 
ON resource_tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create resource tags" 
ON resource_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Resource Tag Relations: anyone can read, only resource owners can modify
CREATE POLICY "Anyone can read resource tag relations" 
ON resource_tag_relations FOR SELECT USING (true);

CREATE POLICY "Resource owners can modify tag relations" 
ON resource_tag_relations FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT created_by FROM resources WHERE id = resource_id
  )
);

CREATE POLICY "Resource owners can delete tag relations" 
ON resource_tag_relations FOR DELETE USING (
  auth.uid() IN (
    SELECT created_by FROM resources WHERE id = resource_id
  )
);

-- Resource Updates: authenticated users can create, only resource owners and admins can view
CREATE POLICY "Users can submit resource updates" 
ON resource_updates FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resource owners can view updates for their resources" 
ON resource_updates FOR SELECT USING (
  auth.uid() IN (
    SELECT created_by FROM resources WHERE id = resource_id
  )
);

-- Admin policies (you would need to set up a custom claim or role for admins)
-- This is a placeholder - you'll need to implement admin role checking
CREATE POLICY "Admins can manage all resources" 
ON resources FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all resource updates" 
ON resource_updates FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
