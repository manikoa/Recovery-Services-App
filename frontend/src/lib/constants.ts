
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
    ENDPOINTS: {
        RESOURCES: '/api/resources',
        CATEGORIES: '/api/categories',
    },
};

export const UI_CONSTANTS = {
    ALL_CATEGORIES: 'All Categories',
    DEFAULT_CITY: 'Seattle', // Example, if needed
    PAGINATION: {
        ITEMS_PER_PAGE: 10,
    },
};
