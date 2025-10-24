/**
 * Supabase Database Types
 * 
 * TypeScript type definitions for the Supabase database schema.
 * These types are used to provide type safety when interacting with Supabase.
 * 
 * Tables:
 * 1. resource_categories - Categories for resources
 * 2. resources - Main resource information
 * 3. resource_tags - Tags for filtering resources
 * 4. resource_tag_relations - Many-to-many relationship between resources and tags
 * 5. resource_updates - Updates submitted for resources
 * 
 * Usage:
 * ```ts
 * import { Database } from '@/types/supabase';
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient<Database>(url, key);
 * ```
 * 
 * Implementation notes:
 * - These types should match the actual database schema in Supabase
 * - Can be generated using Supabase CLI: npx supabase gen types typescript --project-id your-project-id
 * - Update these types whenever the database schema changes
 */

// Define JSON type for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define the Database interface
export interface Database {
  public: {
    Tables: {
      // Resource Categories table
      resource_categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      
      // Resources table
      resources: {
        Row: {
          id: number
          name: string
          slug: string
          description: string
          category_id: number
          address: string | null
          city: string
          state: string
          zip_code: string
          phone: string | null
          email: string | null
          website: string | null
          hours_of_operation: string | null
          eligibility_criteria: string | null
          status: string
          requires_verification: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description: string
          category_id: number
          address?: string | null
          city: string
          state: string
          zip_code: string
          phone?: string | null
          email?: string | null
          website?: string | null
          hours_of_operation?: string | null
          eligibility_criteria?: string | null
          status?: string
          requires_verification?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string
          category_id?: number
          address?: string | null
          city?: string
          state?: string
          zip_code?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          hours_of_operation?: string | null
          eligibility_criteria?: string | null
          status?: string
          requires_verification?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      
      // Add types for other tables:
      // - resource_tags
      // - resource_tag_relations
      // - resource_updates
      
      // Example for resource_tags
      resource_tags: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
      }
      
      // Add remaining table definitions here
    }
    Views: {
      // Add view definitions if needed
    }
    Functions: {
      // Add function definitions if needed
    }
    Enums: {
      // Add enum definitions if needed
    }
  }
}