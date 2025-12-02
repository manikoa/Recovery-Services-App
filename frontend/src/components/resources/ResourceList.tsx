/**
 * Resource List Component
 * 
 * This component displays a list of resources with filtering capabilities.
 * It uses the ResourceCard component to render each resource in a responsive grid.
 */

import ResourceCard from './ResourceCard';

interface Resource {
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

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{resources.length}</span> resource{resources.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </>
  );
}