/**
 * Resource List Component
 * 
 * This component displays a list of resources with filtering capabilities.
 * It uses the ResourceCard component to render each resource in a responsive grid.
 */

import ResourceCard from './ResourceCard';
import { Resource } from '@/types/resource';

interface ResourceListProps {
  resources: Resource[];
  onCategoryClick: (category: string) => void;
}

export default function ResourceList({ resources, onCategoryClick }: ResourceListProps) {
  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{resources.length}</span> resource{resources.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    </>
  );
}