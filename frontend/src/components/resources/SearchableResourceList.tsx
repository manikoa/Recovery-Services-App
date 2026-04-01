'use client';

import { useState, useMemo } from 'react';
import ResourceList from './ResourceList';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
    keyword?: string;
}

interface SearchableResourceListProps {
    initialResources: Resource[];
}

export default function SearchableResourceList({ initialResources }: SearchableResourceListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

    // Extract unique categories
    const categories = useMemo(() => {
        const uniqueCategories = new Set(initialResources.map(r => r.category));
        return ['All Categories', ...Array.from(uniqueCategories).sort()];
    }, [initialResources]);

    // Filter resources based on search query and category
    const filteredResources = useMemo(() => {
        let filtered = initialResources;

        // Filter by category
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(resource => resource.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            // Split by comma to support multi-keyword search
            const queries = searchQuery.toLowerCase().split(',').map(q => q.trim()).filter(q => q.length > 0);

            filtered = filtered.filter((resource) => {
                const searchableText = [
                    resource.name,
                    resource.category,
                    resource.description,
                    resource.services.join(' '),
                    resource.address,
                    resource.phone,
                    resource.keyword || ''
                ].join(' ').toLowerCase();

                // Match if ANY of the comma-separated keywords is found
                return queries.some(query => searchableText.includes(query));
            });
        }

        return filtered;
    }, [initialResources, searchQuery, selectedCategory]);

    return (
        <div className="space-y-8">
            {/* Minimal Search & Filter */}
            <div className="sticky top-24 z-40 max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700 pointer-events-none">
                <div className="pointer-events-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/50 p-2 md:p-1 flex flex-col md:flex-row items-center gap-2 md:gap-0">
                        <div className="flex items-center w-full md:w-auto md:flex-1">
                            <Search className="ml-2 md:ml-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                            <Input
                                type="text"
                                placeholder="Find resources"
                                value={searchQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchQuery(value);

                                    if (value.length > 2) {
                                        // Track search in Google Analytics
                                        if (typeof window !== 'undefined' && (window as any).gtag) {
                                            (window as any).gtag('event', 'search', {
                                                search_term: value
                                            });
                                        }

                                        // Save to Google Sheet
                                        fetch('http://localhost:8001/api/search/track', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ keyword: value })
                                        }).catch(err => console.error('Failed to track search:', err));
                                    }
                                }}
                                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-gray-400 h-10 md:h-12 text-base px-3"
                            />
                        </div>
                        <div className="h-[1px] w-full md:h-8 md:w-[1px] bg-gray-200 md:mx-2" />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px] border-0 shadow-none bg-transparent hover:bg-gray-50 focus:ring-0 h-10 rounded-xl gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium justify-between md:justify-start px-3 md:px-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Category" />
                                </div>
                            </SelectTrigger>
                            <SelectContent align="end" className="w-[200px] border-none shadow-xl bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden p-1">
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category}
                                        value={category}
                                        className="rounded-lg cursor-pointer focus:bg-blue-50 focus:text-blue-600"
                                    >
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results Count & Active Filters */}
                    <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in duration-300 min-h-[2rem] pointer-events-auto relative z-10">
                        {(searchQuery || selectedCategory !== 'All Categories') && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap justify-center">
                                    <span>Found <span className="font-semibold text-gray-900">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''}</span>
                                    {selectedCategory !== 'All Categories' && (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                                            {selectedCategory}
                                        </Badge>
                                    )}
                                    {/* Show a badge for each comma-separated keyword */}
                                    {searchQuery && searchQuery.split(',').map(q => q.trim()).filter(q => q.length > 0).map((term, index) => (
                                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0">
                                            "{term}"
                                        </Badge>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All Categories');
                                    }}
                                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-8 text-xs font-medium gap-1.5"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ResourceList
                resources={filteredResources}
                onCategoryClick={(category) => {
                    setSelectedCategory(category);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        </div>
    );
}