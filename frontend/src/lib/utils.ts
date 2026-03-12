/**
 * Utility Functions
 * 
 * General utility functions used throughout the application.
 * 
 * Functions:
 * 1. cn - A utility for constructing class names with conditional logic
 * 
 * Usage:
 * ```tsx
 * <div className={cn(
 *   "base-class",
 *   isActive && "active-class",
 *   variant === "primary" ? "primary-class" : "secondary-class"
 * )}>
 *   Content
 * </div>
 * ```
 * 
 * Implementation notes:
 * - Uses clsx for class name construction
 * - Uses tailwind-merge to handle Tailwind CSS class conflicts
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single class string,
 * handling Tailwind CSS class conflicts appropriately.
 * 
 * @param inputs - Class values to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}