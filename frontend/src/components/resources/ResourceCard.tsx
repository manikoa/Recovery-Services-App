import { Phone, MapPin, Globe, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <Sheet>
      <Card className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-1 border-0 h-full flex flex-col">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-start justify-between mb-3">
            <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {resource.name}
            </CardTitle>
          </div>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick(resource.category);
            }}
            className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-blue-200 w-fit"
          >
            {resource.category}
          </span>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 flex-1 flex flex-col">
          <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 min-h-[4.5rem]">
            {resource.description}
          </CardDescription>

          <div className="space-y-2.5 pt-2 flex-1">
            {resource.phone && (
              <div className="flex items-center text-sm text-gray-700 group/item">
                <Phone className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                <a
                  href={`tel:${resource.phone}`}
                  className="hover:text-blue-600 transition-colors duration-200 hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
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
                  className="leading-relaxed hover:text-blue-600 transition-colors duration-200 hover:underline line-clamp-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {resource.address}
                </a>
              </div>
            )}
          </div>

          <div className="pt-4 mt-auto border-t border-gray-100">
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-blue-50 text-blue-700 group/button"
              >
                <span className="font-semibold">View Details</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Button>
            </SheetTrigger>
          </div>
        </CardContent>
      </Card>

      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm font-medium rounded-full">
              {resource.category}
            </Badge>
          </div>
          <SheetTitle className="text-3xl font-bold tracking-tight text-gray-900">
            {resource.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 pb-8">
          {/* Main Description */}
          <div className="prose prose-blue max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <SheetDescription className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
              {resource.description}
            </SheetDescription>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>

            {resource.phone && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <a href={`tel:${resource.phone}`} className="text-gray-900 font-medium hover:text-blue-600 hover:underline">
                    {resource.phone}
                  </a>
                </div>
              </div>
            )}

            {resource.address && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:text-blue-600 hover:underline"
                  >
                    {resource.address}
                  </a>
                </div>
              </div>
            )}

            {resource.website && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {resource.hours && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hours</p>
                  <p className="text-gray-900 font-medium">{resource.hours}</p>
                </div>
              </div>
            )}
          </div>

          {/* Services Section if available */}
          {resource.services && resource.services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {resource.services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}