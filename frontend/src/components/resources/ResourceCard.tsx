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
  onCategoryClick: (category: string) => void;
}

export default function ResourceCard({ resource, onCategoryClick }: ResourceCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-1 border-0">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {resource.name}
          </CardTitle>
        </div>
        <span
          onClick={() => onCategoryClick(resource.category)}
          className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-blue-200"
        >
          {resource.category}
        </span>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <CardDescription className="text-gray-600 leading-relaxed">
          {resource.description}
        </CardDescription>

        <div className="space-y-2.5 pt-2">
          {resource.phone && (
            <div className="flex items-center text-sm text-gray-700 group/item">
              <Phone className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
              <a
                href={`tel:${resource.phone}`}
                className="hover:text-blue-600 transition-colors duration-200 hover:underline"
              >
                {resource.phone}
              </a>
            </div>
          )}
          {resource.address && (
            <div className="flex items-start text-sm text-gray-700 group/item">
              <MapPin className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="leading-relaxed hover:text-blue-600 transition-colors duration-200 hover:underline"
              >
                {resource.address}
              </a>
            </div>
          )}
          {resource.website && (
            <div className="flex items-center text-sm text-gray-700 group/item">
              <Globe className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors duration-200 truncate hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
          {resource.hours && (
            <div className="flex items-center text-sm text-gray-700 group/item">
              <Clock className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
              <span>{resource.hours}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}