/**
 * Resources API (Client-side)
 * 
 * Client-side functions for interacting with resources via Python Flask API.
 * All API calls go to the Python backend server.
 */

import { API_CONFIG } from '@/lib/constants';
import type { Resource, ResourceCategory, ResourceTag, ResourceFilters } from '@/types/resource';

// API base URL
const { BASE_URL } = API_CONFIG;

export type { Resource, ResourceCategory, ResourceTag, ResourceFilters };

/**
 * Get all resource categories
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`);
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

    const url = `${BASE_URL}${API_CONFIG.ENDPOINTS.RESOURCES}${params.toString() ? `?${params.toString()}` : ''}`;
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
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.RESOURCES}/${slug}`);
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
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.RESOURCES}/${resourceId}`, {
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
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.RESOURCES}`, {
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