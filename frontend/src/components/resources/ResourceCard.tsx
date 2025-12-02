import { Phone, MapPin, Globe, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl">{resource.name}</CardTitle>
        </div>
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          {resource.category}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-gray-600">
          {resource.description}
        </CardDescription>
        <div className="space-y-2">
          {resource.phone && (
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <a 
                href={`tel:${resource.phone}`}
                className="hover:text-blue-600 transition-colors"
              >
                {resource.phone}
              </a>
            </div>
          )}
          {resource.address && (
            <div className="flex items-start text-sm text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{resource.address}</span>
            </div>
          )}
          {resource.website && (
            <div className="flex items-center text-sm text-gray-700">
              <Globe className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <a 
                href={resource.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors truncate"
              >
                Visit Website
              </a>
            </div>
          )}
          {resource.hours && (
            <div className="flex items-center text-sm text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <span>{resource.hours}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}