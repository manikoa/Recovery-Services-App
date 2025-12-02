'use client';

import { useState, useEffect } from 'react';
import ResourceList from '@/components/resources/ResourceList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Type for the API response
interface ApiResource {
  id: number;
  name: string;
  category_name?: string;
  description: string;
  phone: string | null;
  address: string | null;
  city: string;
  state: string;
  zip_code: string;
  website: string | null;
  hours_of_operation: string | null;
  tags?: string[] | string;
}

// Type for the transformed resource (what ResourceList expects)
interface TransformedResource {
  id: number;
  name: string;
  category: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  hours: string;
  services: string[];
}

// Transform API resource to ResourceList format
function transformResource(apiResource: ApiResource): TransformedResource {
  // Build full address from components
  // If address already contains city/state, use it as-is; otherwise combine components
  let fullAddress = '';
  if (apiResource.address) {
    // Check if address already contains city/state info
    const addressLower = apiResource.address.toLowerCase();
    const cityLower = apiResource.city?.toLowerCase() || '';
    if (cityLower && addressLower.includes(cityLower)) {
      // Address already contains city, use as-is
      fullAddress = apiResource.address;
    } else {
      // Combine address components
      const addressParts = [
        apiResource.address,
        apiResource.city,
        apiResource.state,
        apiResource.zip_code
      ].filter(Boolean);
      fullAddress = addressParts.join(', ');
    }
  } else {
    // No address, just use city/state/zip
    const addressParts = [
      apiResource.city,
      apiResource.state,
      apiResource.zip_code
    ].filter(Boolean);
    fullAddress = addressParts.join(', ');
  }

  // Parse tags/services
  let services: string[] = [];
  if (apiResource.tags) {
    if (Array.isArray(apiResource.tags)) {
      services = apiResource.tags;
    } else if (typeof apiResource.tags === 'string') {
      services = apiResource.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  return {
    id: apiResource.id,
    name: apiResource.name,
    category: apiResource.category_name || 'Uncategorized',
    description: apiResource.description || '',
    phone: apiResource.phone || '',
    address: fullAddress,
    website: apiResource.website || '',
    hours: apiResource.hours_of_operation || '',
    services: services
  };
}

export default function Home() {
  const [resources, setResources] = useState<TransformedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch resources from backend with optional search query
  const fetchResources = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with query parameter if provided
      const url = query && query.trim() 
        ? `/api/resources?query=${encodeURIComponent(query.trim())}`
        : '/api/resources';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      const apiResources: ApiResource[] = data.data || [];
      
      // Transform API resources to the format expected by ResourceList
      const transformedResources = apiResources.map(transformResource);
      
      setResources(transformedResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching resources');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search as user types
  useEffect(() => {
    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        // Fetch with search query
        fetchResources(searchQuery);
      } else {
        // If search is empty, fetch all resources
        fetchResources();
      }
    }, 300); // 300ms debounce delay

    // Cleanup timeout on unmount or when searchQuery changes
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search button click (optional, for immediate search)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, fetch all resources
      fetchResources();
    } else {
      // Fetch with search query
      fetchResources(searchQuery);
    }
  };

  // Handle Enter key in search input (optional, for immediate search)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center animate-in fade-in duration-500">
            <div className="relative mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading resources...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the latest information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-red-100 border-0 rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-red-800 font-bold text-xl mb-2">Error Loading Resources</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="mb-12 animate-in fade-in slide-in-from-top duration-700">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative group">
            <Input
              type="text"
              placeholder="Search resources by name, category, description, location, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pr-12 h-12 border-0 bg-white shadow-md hover:shadow-lg focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all duration-300 rounded-xl pl-4 text-base placeholder:text-gray-400"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
          </div>
          <Button
            onClick={handleSearch}
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 border-0"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        {searchQuery && !loading && (
          <p className="text-sm text-gray-600 mt-3 text-center animate-in fade-in duration-300">
            {resources.length === 0
              ? 'No resources found matching your search.'
              : `Found ${resources.length} resource${resources.length !== 1 ? 's' : ''} matching "${searchQuery}"`}
          </p>
        )}
      </div>

      <ResourceList resources={resources} />
    </div>
  );
}