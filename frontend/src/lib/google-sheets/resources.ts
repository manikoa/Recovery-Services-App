/**
 * Resources API
 * 
 * Functions for interacting with resources stored in Google Sheets.
 * Provides typed access to resource data and operations.
 * 
 * Usage:
 * ```ts
 * // Get resources with filters
 * const resources = await getResources({ category: 'food', city: 'Springfield' });
 * 
 * // Get a single resource
 * const resource = await getResourceBySlug('community-food-bank');
 * 
 * // Submit an update
 * await updateResource(resourceId, { name: 'Updated Name' });
 * ```
 */

import { readSheet, appendToSheet, updateSheet } from './client';

// Define types for resources and related entities
export type ResourceCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon?: string | null;
};

export type ResourceTag = {
  id: number;
  name: string;
  slug: string;
};

export type Resource = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  category?: ResourceCategory;
  category_name?: string;
  address: string | null;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  hours_of_operation: string | null;
  eligibility_criteria: string | null;
  status: string;
  requires_verification: boolean;
  tags?: ResourceTag[] | string[];
  created_at: string;
  updated_at: string;
};

export type ResourceFilters = {
  category?: string;
  city?: string;
  state?: string;
  tags?: string[];
  query?: string;
  status?: string;
};

/**
 * Parse a row from Google Sheets into a Resource object
 */
function parseResourceRow(row: any[], headers: string[]): Resource | null {
  if (row.length < headers.length) {
    row = [...row, ...Array(headers.length - row.length).fill('')];
  }

  const resource: any = {};
  headers.forEach((header, index) => {
    resource[header] = row[index] || '';
  });

  // Convert string values to appropriate types
  const id = parseInt(resource.id || '0', 10);
  if (isNaN(id) || id === 0) {
    return null; // Skip invalid rows
  }

  return {
    id,
    name: resource.name || '',
    slug: resource.slug || '',
    description: resource.description || '',
    category_id: parseInt(resource.category_id || '0', 10),
    category_name: resource.category_name || '',
    address: resource.address || null,
    city: resource.city || '',
    state: resource.state || '',
    zip_code: resource.zip_code || '',
    phone: resource.phone || null,
    email: resource.email || null,
    website: resource.website || null,
    hours_of_operation: resource.hours_of_operation || null,
    eligibility_criteria: resource.eligibility_criteria || null,
    status: resource.status || 'pending',
    requires_verification: resource.requires_verification?.toLowerCase() === 'true',
    tags: resource.tags ? resource.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    created_at: resource.created_at || new Date().toISOString(),
    updated_at: resource.updated_at || new Date().toISOString(),
  };
}

/**
 * Get all resource categories
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    const rows = await readSheet('Categories!A2:D');
    
    const categories: ResourceCategory[] = [];
    const headers = ['id', 'name', 'slug', 'description'];
    
    for (const row of rows) {
      if (row.length < headers.length) {
        continue;
      }
      
      const id = parseInt(row[0] || '0', 10);
      if (isNaN(id) || id === 0) {
        continue;
      }
      
      categories.push({
        id,
        name: row[1] || '',
        slug: row[2] || '',
        description: row[3] || null,
      });
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all resource tags
 */
export async function getResourceTags(): Promise<ResourceTag[]> {
  // Tags might be stored in a separate sheet or derived from resources
  // For now, return empty array - can be implemented based on your needs
  return [];
}

/**
 * Get resources with optional filters
 */
export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  try {
    const rows = await readSheet('Resources!A2:Z');
    
    const headers = [
      'id', 'name', 'slug', 'description', 'category_id', 'category_name',
      'address', 'city', 'state', 'zip_code', 'phone', 'email', 'website',
      'hours_of_operation', 'eligibility_criteria', 'status',
      'requires_verification', 'tags', 'created_at', 'updated_at'
    ];
    
    const resources: Resource[] = [];
    
    for (const row of rows) {
      const resource = parseResourceRow(row, headers);
      if (!resource) continue;
      
      // Apply filters
      if (filters) {
        if (filters.category && resource.category_name?.toLowerCase() !== filters.category.toLowerCase()) {
          continue;
        }
        if (filters.city && !resource.city.toLowerCase().includes(filters.city.toLowerCase())) {
          continue;
        }
        if (filters.state && resource.state.toUpperCase() !== filters.state.toUpperCase()) {
          continue;
        }
        if (filters.status && resource.status.toLowerCase() !== filters.status.toLowerCase()) {
          continue;
        }
        if (filters.query) {
          const query = filters.query.toLowerCase();
          const matches = 
            resource.name.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query) ||
            resource.city.toLowerCase().includes(query);
          if (!matches) continue;
        }
      } else {
        // Default to active resources
        if (resource.status.toLowerCase() !== 'active') {
          continue;
        }
      }
      
      resources.push(resource);
    }
    
    return resources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

/**
 * Get a resource by slug
 */
export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    const resources = await getResources({ status: undefined }); // Get all including inactive
    
    return resources.find(r => r.slug.toLowerCase() === slug.toLowerCase()) || null;
  } catch (error) {
    console.error('Error fetching resource by slug:', error);
    return null;
  }
}

/**
 * Submit an update for a resource
 */
export async function updateResource(resourceId: number, updates: Partial<Resource>): Promise<boolean> {
  try {
    // First, get all resources to find the row index
    const resources = await getResources({ status: undefined });
    const resourceIndex = resources.findIndex(r => r.id === resourceId);
    
    if (resourceIndex === -1) {
      return false;
    }
    
    const rowIndex = resourceIndex + 2; // +2 for header row and 0-indexed
    
    // Map updates to column indices
    const columnMap: Record<string, number> = {
      name: 1,
      slug: 2,
      description: 3,
      category_id: 4,
      category_name: 5,
      address: 6,
      city: 7,
      state: 8,
      zip_code: 9,
      phone: 10,
      email: 11,
      website: 12,
      hours_of_operation: 13,
      eligibility_criteria: 14,
      status: 15,
      requires_verification: 16,
      tags: 17,
      updated_at: 19,
    };
    
    // Update each field
    for (const [field, value] of Object.entries(updates)) {
      if (field in columnMap) {
        const colIndex = columnMap[field];
        const colLetter = String.fromCharCode(65 + colIndex); // A, B, C, etc.
        const range = `Resources!${colLetter}${rowIndex}`;
        
        let updateValue: any = value;
        if (field === 'tags' && Array.isArray(value)) {
          updateValue = value.join(',');
        } else if (field === 'requires_verification') {
          updateValue = value ? 'true' : 'false';
        } else if (field === 'updated_at') {
          updateValue = new Date().toISOString();
        }
        
        await updateSheet(range, [[updateValue]]);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating resource:', error);
    return false;
  }
}

/**
 * Create a new resource
 */
export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource | null> {
  try {
    // Get existing resources to determine next ID
    const existingResources = await getResources({ status: undefined });
    const nextId = Math.max(...existingResources.map(r => r.id), 0) + 1;
    
    const now = new Date().toISOString();
    
    const row = [
      nextId,
      resource.name,
      resource.slug,
      resource.description,
      resource.category_id,
      resource.category_name || '',
      resource.address || '',
      resource.city,
      resource.state,
      resource.zip_code,
      resource.phone || '',
      resource.email || '',
      resource.website || '',
      resource.hours_of_operation || '',
      resource.eligibility_criteria || '',
      resource.status || 'pending',
      resource.requires_verification ? 'true' : 'false',
      Array.isArray(resource.tags) ? resource.tags.join(',') : (resource.tags || ''),
      now,
      now,
    ];
    
    await appendToSheet('Resources!A2:Z', [row]);
    
    return {
      ...resource,
      id: nextId,
      created_at: now,
      updated_at: now,
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return null;
  }
}














