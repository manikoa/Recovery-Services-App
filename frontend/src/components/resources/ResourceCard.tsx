'use client';

import { useState } from 'react';
import { Phone, MapPin, Globe, Clock, ArrowRight, ExternalLink, X, ChevronDown, CheckCircle2, Info } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onCategoryClick: (category: string) => void;
}

export default function ResourceCard({ resource, onCategoryClick }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Sheet>
      <div className="relative group bg-gradient-to-br from-white to-[#a7c4ff]/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-[#a7c4ff]/20 transition-all duration-500 border border-[#a7c4ff]/20 hover:border-[#a7c4ff] overflow-hidden h-full flex flex-col">
        {/* Decorative background gradient - Peach Accent on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#ffd8b3]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(resource.category_name || 'Uncategorized');
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#a7c4ff] text-blue-950 cursor-pointer hover:bg-[#96b3ed] transition-colors shadow-sm border border-blue-900/5"
                >
                  {resource.category_name}
                </span>
                {resource.status === 'Verified' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#7bf1a8] text-green-950 shadow-sm border border-green-900/5">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                {resource.name}
              </h3>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {resource.description}
          </p>

          {/* Quick Info Grid */}
          <div className="mt-auto pt-4 border-t border-[#a7c4ff]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.phone && (
                <div className="flex items-center text-gray-700 group/item">
                  <div className="p-2 rounded-lg bg-white/80 text-blue-600 group-hover/item:bg-[#a7c4ff] group-hover/item:text-blue-950 transition-colors mr-3 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{resource.phone}</span>
                </div>
              )}

              {resource.ui_hours && (
                <div className="flex items-center text-gray-700 group/item">
                  <div className="p-2 rounded-lg bg-white/80 text-orange-600 group-hover/item:bg-[#ffd8b3] group-hover/item:text-orange-950 transition-colors mr-3 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{resource.ui_hours}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <SheetTrigger asChild>
              <Button
                className={cn(
                  "w-full md:w-auto px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all",
                  "bg-[#a7c4ff] text-blue-950 hover:bg-[#96b3ed] shadow-md border border-blue-900/5"
                )}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </div>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white p-0 gap-0 border-l shadow-2xl">
        <SheetHeader className="p-6 md:p-8 sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-20 border-b border-gray-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-soft-blue/20 text-blue-900 hover:bg-soft-blue/30 border-none px-4 py-1.5 text-sm">
                {resource.category_name}
              </Badge>
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
            <SheetTitle className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {resource.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="p-6 md:p-8 space-y-8 pb-32">

          {/* Main Info Section */}
          <div className="space-y-6">
            <div className="prose prose-blue max-w-none">
              <p className="text-lg text-gray-600 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {resource.eligibility_criteria && (
              <div className="bg-soft-blue/20 rounded-xl p-6 border border-soft-blue/30">
                <h4 className="flex items-center text-sm font-semibold text-blue-900 uppercase tracking-wider mb-3">
                  <Info className="w-4 h-4 mr-2" />
                  Eligibility
                </h4>
                <p className="text-gray-700">{resource.eligibility_criteria}</p>
              </div>
            )}
          </div>

          {/* Contact & Location Grid */}
          <div className="grid grid-cols-1 gap-6">
            {resource.phone && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-soft-blue-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <a href={`tel:${resource.phone}`} className="text-gray-900 font-medium hover:text-soft-blue-dark hover:underline">
                    {resource.phone}
                  </a>
                </div>
              </div>
            )}

            {resource.address && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-soft-blue-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:text-soft-blue-dark hover:underline"
                  >
                    {resource.address}
                  </a>
                </div>
              </div>
            )}

            {resource.website && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 h-5 text-soft-blue-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-soft-blue-dark font-medium hover:underline flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {(resource.ui_hours || resource.hours_of_operation) && (
              <div className="flex items-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-soft-blue-dark" />
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
                    className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-soft-blue/20 hover:border-soft-blue/30 transition-all duration-300"
                  >
                    <span className="text-base font-medium text-gray-700 group-hover:text-blue-900">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        <div className="p-8 mt-auto sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <SheetClose asChild>
            <Button
              className={cn(
                "w-full h-12 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                "bg-[#a7c4ff] text-blue-950 hover:bg-[#96b3ed] border border-blue-900/5"
              )}
            >
              Close Details
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet >
  );
}