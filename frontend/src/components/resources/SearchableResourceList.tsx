'use client';

import { useState, useMemo } from 'react';
import ResourceList from './ResourceList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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

interface SearchableResourceListProps {
    initialResources: Resource[];
}

export default function SearchableResourceList({ initialResources }: SearchableResourceListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter resources based on search query
    const filteredResources = useMemo(() => {
        if (!searchQuery.trim()) return initialResources;

        const query = searchQuery.toLowerCase().trim();
        return initialResources.filter((resource) => {
            const searchableText = [
                resource.name,
                resource.category,
                resource.description,
                resource.services.join(' '),
                resource.address,
                resource.phone
            ].join(' ').toLowerCase();

            return searchableText.includes(query);
        });
    }, [initialResources, searchQuery]);

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-12 animate-in fade-in slide-in-from-top duration-700">
                <div className="flex gap-3 max-w-2xl mx-auto">
                    <div className="flex-1 relative group">
                        <Input
                            type="text"
                            placeholder="Search resources by name, category, description, location, or services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-12 h-12 border-0 bg-white shadow-md hover:shadow-lg focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all duration-300 rounded-xl pl-4 text-base placeholder:text-gray-400"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                    </div>
                    <Button
                        className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 border-0"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                </div>
                {searchQuery && (
                    <p className="text-sm text-gray-600 mt-3 text-center animate-in fade-in duration-300">
                        {filteredResources.length === 0
                            ? 'No resources found matching your search.'
                            : `Found ${filteredResources.length} resource${filteredResources.length !== 1 ? 's' : ''} matching "${searchQuery}"`}
                    </p>
                )}
            </div>

            <ResourceList resources={filteredResources} />
        </div>
    );
}
