'use client';

import { useState, useMemo } from 'react';
import ResourceList from './ResourceList';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
}

interface SearchableResourceListProps {
    initialResources: Resource[];
}

export default function SearchableResourceList({ initialResources }: SearchableResourceListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Extract unique categories
    const categories = useMemo(() => {
        const uniqueCategories = new Set(initialResources.map(r => r.category));
        return ['All Categories', ...Array.from(uniqueCategories).filter(Boolean).sort()];
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
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((resource) => {
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
        }

        return filtered;
    }, [initialResources, searchQuery, selectedCategory]);

    const activeFilterCount = selectedCategory !== 'All Categories' ? 1 : 0;

    return (
        <div className="space-y-8">
            {/* Minimal Search & Filter */}
            <div className="sticky top-24 z-40 max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700 pointer-events-none">
                <div className="pointer-events-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative bg-background/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-border/50 p-2 md:p-1 flex flex-col md:flex-row items-center gap-2 md:gap-0">
                        <div className="flex items-center w-full md:w-auto md:flex-1">
                            <Search className="ml-2 md:ml-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                            <Input
                                type="text"
                                placeholder="Find resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground h-10 md:h-12 text-base px-3"
                            />
                        </div>
                        <div className="h-[1px] w-full md:h-8 md:w-[1px] bg-border md:mx-2" />

                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full md:w-auto h-10 rounded-xl gap-2 text-muted-foreground hover:text-primary hover:bg-accent transition-colors font-medium justify-between md:justify-start px-3 md:px-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span>Filters</span>
                                    </div>
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary" className="bg-primary/10 text-primary h-5 px-1.5 min-w-[1.25rem] flex items-center justify-center">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:w-[400px] overflow-y-auto p-0 flex flex-col gap-0 border-l border-border/10 bg-white">
                                <SheetHeader className="px-8 py-8 space-y-2 text-left bg-white sticky top-0 z-10">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="text-3xl font-light tracking-tight text-gray-900">Filters</SheetTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsFilterOpen(false)}
                                            className="-mr-4 h-10 w-10 text-gray-400 hover:text-gray-900 rounded-full"
                                        >
                                            <X className="h-6 w-6" />
                                            <span className="sr-only">Close</span>
                                        </Button>
                                    </div>
                                    <p className="text-base text-gray-500 font-light">Narrow down resources by category</p>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto px-8 pb-8">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category}
                                                        onClick={() => setSelectedCategory(category)}
                                                        className={`
                                                            group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border
                                                            ${selectedCategory === category
                                                                ? 'bg-gray-50 text-gray-900 border-gray-200 shadow-sm'
                                                                : 'hover:bg-gray-50 border-transparent text-gray-500 hover:text-gray-900'}
                                                        `}
                                                    >
                                                        <span className="text-base font-medium">{category}</span>
                                                        {selectedCategory === category && (
                                                            <div className="h-2.5 w-2.5 rounded-full bg-gray-900 shadow-sm" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 mt-auto sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                                    <div className="">
                                        <Button
                                            className="w-full h-12 rounded-xl text-base bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                            onClick={() => setIsFilterOpen(false)}
                                        >
                                            View {filteredResources.length} Results
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Results Count & Active Filters */}
                    <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in duration-300 min-h-[2rem] pointer-events-auto relative z-10">
                        {(searchQuery || selectedCategory !== 'All Categories') && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Found <span className="font-semibold text-foreground">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''}</span>
                                    {selectedCategory !== 'All Categories' && (
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 flex items-center gap-1">
                                            {selectedCategory}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-primary/80"
                                                onClick={() => setSelectedCategory('All Categories')}
                                            />
                                        </Badge>
                                    )}
                                    {searchQuery && (
                                        <Badge variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/80 border-0 flex items-center gap-1">
                                            "{searchQuery}"
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-accent-foreground/80"
                                                onClick={() => setSearchQuery('')}
                                            />
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All Categories');
                                    }}
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 text-xs font-medium gap-1.5"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Clear All
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
