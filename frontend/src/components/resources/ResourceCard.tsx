'use client';

import { useState } from 'react';
import { Phone, MapPin, Globe, Clock, ArrowRight, ExternalLink, X, ChevronDown } from 'lucide-react';
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
  SheetClose,
} from "@/components/ui/sheet";
import { Resource } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
  onCategoryClick: (category: string) => void;
}

export default function ResourceCard({ resource, onCategoryClick }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              onCategoryClick(resource.category_name || 'Uncategorized');
            }}
            className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-blue-200 w-fit"
          >
            {resource.category_name}
          </span>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 flex-1 flex flex-col">
          <CardDescription className="text-gray-600 leading-relaxed min-h-[3rem]">
            {resource.description.length > 100
              ? `${resource.description.substring(0, 100)}...`
              : resource.description}
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

      <SheetContent className="w-full sm:w-[540px] p-0 flex flex-col gap-0 border-l border-border/10 bg-white">
        <SheetHeader className="px-8 py-8 space-y-4 text-left bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-8">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 pointer-events-none mb-2 hover:bg-blue-50">
                {resource.category_name}
              </Badge>
              <SheetTitle className="text-3xl font-light tracking-tight text-gray-900 leading-tight">
                {resource.name}
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-4 h-10 w-10 text-gray-400 hover:text-gray-900 rounded-full"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-8">
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

              {(resource.ui_hours || resource.hours_of_operation) && (
                <div className="flex items-center group">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hours</p>
                    <p className="text-gray-900 font-medium">{resource.ui_hours || resource.hours_of_operation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Services Section */}
            {resource.services && resource.services.length > 0 && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between text-left group py-2"
                >
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors">
                    Services
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <div className={`grid grid-cols-1 gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'opacity-100 max-h-[1000px] mt-4' : 'opacity-0 max-h-0 mt-0'
                  }`}>
                  {resource.services.map((service, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-blue-50 hover:border-blue-100 transition-all duration-300"
                    >
                      <span className="text-base font-medium text-gray-700 group-hover:text-blue-700">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 mt-auto sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <SheetClose asChild>
            <Button
              className="w-full h-12 rounded-xl text-base bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Close Details
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}