/**
 * Resources API (Client-side)
 * 
 * Client-side functions for interacting with resources via Python Flask API.
 * All API calls go to the Python backend server.
 */

// API base URL - defaults to localhost:5000, can be overridden with env var
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Type definitions
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
 * Get all resource categories
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all resource tags
 */
export async function getResourceTags(): Promise<ResourceTag[]> {
  // Tags can be derived from resources or stored separately
  // For now, return empty array
  return [];
}

/**
 * Get resources with optional filters
 */
export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.query) params.append('query', filters.query);
    
    const url = `${API_BASE_URL}/api/resources${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    
    const data = await response.json();
    return data.data || [];
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
    const response = await fetch(`${API_BASE_URL}/api/resources/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch resource');
    }
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

/**
 * Submit an update for a resource
 */
export async function submitResourceUpdate(resourceId: number, updates: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resources/${resourceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update resource');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating resource:', error);
    return null;
  }
}

/**
 * Update a resource (alias for submitResourceUpdate for consistency)
 */
export async function updateResource(resourceId: number, updates: any) {
  return submitResourceUpdate(resourceId, updates);
}

/**
 * Create a new resource
 */
export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create resource');
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error creating resource:', error);
    return null;
  }
}