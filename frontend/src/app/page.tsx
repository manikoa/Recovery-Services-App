import SearchableResourceList from '@/components/resources/SearchableResourceList';

// Type for the Google Apps Script API response
interface GoogleSheetResource {
  id: number;
  name: string;
  category: string;
  description: string;
  phone: string | number;
  email: string;
  address: string;
  website: string;
  services: string[];
}

interface GoogleSheetResponse {
  data: GoogleSheetResource[];
  success: boolean;
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
function transformResource(resource: GoogleSheetResource): TransformedResource {
  return {
    id: resource.id,
    name: resource.name,
    category: resource.category || 'Uncategorized',
    description: resource.description || '',
    phone: resource.phone ? String(resource.phone) : '',
    address: resource.address || '', // The API currently returns empty string, but we map it just in case
    website: resource.website || '',
    hours: '', // Not currently in the spreadsheet data
    services: resource.services || []
  };
}

async function getResources(): Promise<TransformedResource[]> {
  // Use the verified Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFsGB4hTPHQVCtXmdrkXhNq38MWjEOVoMCHWn3j7WP2Wcodabz81hk6q19i3PD3I5N/exec';

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      cache: 'no-store', // Ensure fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch resources:', response.status, response.statusText);
      return [];
    }

    const json: GoogleSheetResponse = await response.json();

    if (!json.success || !json.data) {
      console.error('API returned unsuccessful response:', json);
      return [];
    }

    return json.data.map(transformResource);
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