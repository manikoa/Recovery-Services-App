import SearchableResourceList from '@/components/resources/SearchableResourceList';
import { getResources } from '@/lib/api/resources';
import type { Resource } from '@/lib/api/resources';

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
function transformResource(resource: Resource): TransformedResource {
  // Handle tags which might be a string (comma-separated) or an array
  let services: string[] = [];
  if (Array.isArray(resource.tags)) {
    services = resource.tags.map(t => typeof t === 'string' ? t : t.name);
  } else if (typeof resource.tags === 'string') {
    services = (resource.tags as string).split(',').map(s => s.trim()).filter(Boolean);
  }

  // Construct full address
  const fullAddress = [
    resource.address,
    resource.city,
    resource.state,
    resource.zip_code
  ].filter(Boolean).join(', ');

  return {
    id: resource.id,
    name: resource.name,
    category: resource.category_name || 'Uncategorized',
    description: resource.description || '',
    phone: resource.phone || '',
    address: fullAddress,
    website: resource.website || '',
    hours: resource.hours_of_operation || '',
    services: services
  };
}

export default async function Home() {
  const apiResources = await getResources();
  const resources = apiResources.map(transformResource);

  return (
    <div className="container mx-auto px-4 py-12">
      <SearchableResourceList initialResources={resources} />
    </div>
  );
}