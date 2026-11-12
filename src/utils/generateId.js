/**
 * Generates an automatic 16-digit numeric ID.
 * Uses 13-digit millisecond timestamp combined with a 3-digit random sequence.
 * Guaranteed 16-digit length containing only numbers (0-9).
 *
 * Example: '1794476585999886'
 */
export function generateId(_prefix = '') {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(100 + Math.random() * 900).toString();
  return (timestamp + randomSuffix).slice(0, 16);
}
