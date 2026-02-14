
export type ResourceCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon?: string | null;
};

export type ResourceTag = {
    id: number;
    name: string;
    slug: string;
};

export type Resource = {
    id: number;
    name: string;
    slug: string;
    description: string;
    category_id: number;
    category?: ResourceCategory;
    category_name?: string;
    address: string | null;
    city: string;
    state: string;
    zip_code: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    hours_of_operation: string | null; // Mapped from 'hours' in some places
    eligibility_criteria: string | null;
    status: string;
    requires_verification: boolean;
    tags?: ResourceTag[] | string[];
    services?: string[]; // Frontend specific helper
    created_at: string;
    updated_at: string;
    // Normalized fields for UI
    ui_hours?: string;
};

export type ResourceFilters = {
    category?: string;
    city?: string;
    state?: string;
    tags?: string[];
    query?: string;
    status?: string;
};
