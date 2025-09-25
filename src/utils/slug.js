/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} A URL-friendly slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a property using ID and title
 * @param {number} id - The property ID
 * @param {string} title - The property title
 * @returns {string} A unique slug combining ID and title
 */
export function generatePropertySlug(id, title) {
  const titleSlug = generateSlug(title);
  return `${id}-${titleSlug}`;
}

/**
 * Extract ID from a property slug
 * @param {string} slug - The property slug
 * @returns {number} The property ID
 */
export function extractPropertyId(slug) {
  const id = parseInt(slug.split('-')[0]);
  return isNaN(id) ? 0 : id;
}

/**
 * Generate a unique slug for a vehicle using ID, make, model, and year
 * @param {number} id - The vehicle ID
 * @param {string} make - The vehicle make
 * @param {string} model - The vehicle model
 * @param {number} year - The vehicle year
 * @returns {string} A unique slug combining ID, make, model, and year
 */
export function generateVehicleSlug(id, make, model, year) {
  const makeSlug = generateSlug(make);
  const modelSlug = generateSlug(model);
  return `${id}-${year}-${makeSlug}-${modelSlug}`;
}

/**
 * Extract ID from a vehicle slug
 * @param {string} slug - The vehicle slug
 * @returns {number} The vehicle ID
 */
export function extractVehicleId(slug) {
  const id = parseInt(slug.split('-')[0]);
  return isNaN(id) ? 0 : id;
}
