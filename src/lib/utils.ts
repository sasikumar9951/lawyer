import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a consistent, URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 * 
 * Examples:
 * - "Corporate Law" → "corporate-law"
 * - "Business & Tax Services" → "business-tax-services"
 * - "Real Estate & Property" → "real-estate-property"
 * - "Contract Review & Drafting" → "contract-review-drafting"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}
