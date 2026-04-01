import SearchableResourceList from '@/components/resources/SearchableResourceList';

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
  keyword?: string;
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
  keyword?: string;  // ← ADD THIS

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
    services: services,
    keyword: apiResource.keyword || ''  // ← ADD THIS

  };
}

async function getResources(): Promise<TransformedResource[]> {
  const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8001';

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/resources`, {
      cache: 'no-store', // Ensure fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch resources:', response.status, response.statusText);
      // Return empty array on error to allow page to render
      return [];
    }

    const data = await response.json();
    const apiResources: ApiResource[] = data.data || [];
    return apiResources.map(transformResource);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export default async function Home() {
  const resources = await getResources();

  return (
    <div className="container mx-auto px-4 py-12">
      <SearchableResourceList initialResources={resources} />
    </div>
  );
}