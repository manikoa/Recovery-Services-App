import SearchableResourceList from '@/components/resources/SearchableResourceList';
import { getResources } from '@/lib/api/resources';
import { transformResource } from '@/lib/transformers';
import { Resource } from '@/types/resource';

export default async function Home() {
  const apiResources = await getResources();
  const resources = apiResources.map(transformResource);

  return (
    <div className="container mx-auto px-4 py-12">
      <SearchableResourceList initialResources={resources} />
    </div>
  );
}