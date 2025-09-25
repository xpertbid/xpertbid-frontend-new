/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a property using ID and title
 * @param id - The property ID
 * @param title - The property title
 * @returns A unique slug combining ID and title
 */
export function generatePropertySlug(id: number, title: string): string {
  const titleSlug = generateSlug(title);
  return `${id}-${titleSlug}`;
}

/**
 * Extract ID from a property slug
 * @param slug - The property slug
 * @returns The property ID
 */
export function extractPropertyId(slug: string): number {
  const id = parseInt(slug.split('-')[0]);
  return isNaN(id) ? 0 : id;
}

/**
 * Generate a unique slug for a vehicle using ID, make, model, and year
 * @param id - The vehicle ID
 * @param make - The vehicle make
 * @param model - The vehicle model
 * @param year - The vehicle year
 * @returns A unique slug combining ID, make, model, and year
 */
export function generateVehicleSlug(id: number, make: string, model: string, year: number): string {
  const makeSlug = generateSlug(make);
  const modelSlug = generateSlug(model);
  return `${id}-${year}-${makeSlug}-${modelSlug}`;
}

/**
 * Extract ID from a vehicle slug
 * @param slug - The vehicle slug
 * @returns The vehicle ID
 */
export function extractVehicleId(slug: string): number {
  const id = parseInt(slug.split('-')[0]);
  return isNaN(id) ? 0 : id;
}
