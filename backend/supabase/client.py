"""
Utility functions for interacting with Supabase.
This file can be used for server-side operations that need to interact with Supabase.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """
    Returns a Supabase client instance using credentials from environment variables.
    
    Returns:
        Client: A configured Supabase client
    """
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    
    if not url or not key:
        raise ValueError("Supabase URL and key must be set in environment variables")
    
    return create_client(url, key)

def get_supabase_admin_client() -> Client:
    """
    Returns a Supabase client with admin privileges using the service key.
    
    Returns:
        Client: A configured Supabase admin client
    """
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY')
    
    if not url or not key:
        raise ValueError("Supabase URL and service key must be set in environment variables")
    
    return create_client(url, key)

# Example functions for working with resources

def get_resources(filters=None):
    """
    Get resources from Supabase with optional filters
    
    Args:
        filters: Dictionary of filters to apply
        
    Returns:
        List of resources
    """
    client = get_supabase_client()
    query = client.table('resources').select('*, category:category_id(*), tags:resource_tag_relations(tag:tag_id(*))')
    
    if filters:
        if 'category' in filters:
            query = query.eq('category_id', filters['category'])
        if 'city' in filters:
            query = query.ilike('city', f"%{filters['city']}%")
        if 'state' in filters:
            query = query.eq('state', filters['state'])
        if 'status' in filters:
            query = query.eq('status', filters['status'])
        else:
            # Default to active resources
            query = query.eq('status', 'active')
    else:
        # Default to active resources
        query = query.eq('status', 'active')
    
    response = query.execute()
    
    return response.data

def get_resource_by_slug(slug):
    """
    Get a resource by its slug
    
    Args:
        slug: The resource slug
        
    Returns:
        Resource data or None if not found
    """
    client = get_supabase_client()
    response = client.table('resources') \
        .select('*, category:category_id(*), tags:resource_tag_relations(tag:tag_id(*))') \
        .eq('slug', slug) \
        .eq('status', 'active') \
        .single() \
        .execute()
    
    return response.data
