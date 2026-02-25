
import { Resource } from '@/types/resource';

/**
 * Transform API resource to UI-friendly format.
 * - Flattens address components.
 * - Normalizes services/tags.
 * - Handles missing values.
 */
export function transformResource(resource: Resource): Resource {
    // Handle tags which might be a string (comma-separated) or an array
    let services: string[] = [];
    if (Array.isArray(resource.tags)) {
        // If tags are objects or strings, handle accordingly.
        // The API type says tags?: ResourceTag[] | string[];
        // We assume if it's an object with name, we use that.
        services = resource.tags.map(t => typeof t === 'string' ? t : t.name);
    } else if (typeof resource.tags === 'string') {
        services = (resource.tags as string).split(',').map(s => s.trim()).filter(Boolean);
    }


    return {
        ...resource,
        // Ensure category_name fallback
        category_name: resource.category_name || 'Uncategorized',
        // Use full address for UI, but keep individual fields for logic if needed
        address: resource.address,
        // Normalize services
        services: services.length > 0 ? services : [],
        // Ui hours mapping
        ui_hours: resource.hours_of_operation || '',
    };
}
