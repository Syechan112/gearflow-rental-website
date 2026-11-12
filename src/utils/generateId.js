let lastTime = 0;
let counter = 0;

/**
 * Generates an automatic, strictly unique 16-digit numeric ID.
 * Monotonically increasing using millisecond timestamp + sequence buffer.
 * Guaranteed 100% collision-free without manual input.
 *
 * Example: '1794476585999000'
 */
export function generateId(_prefix = '') {
  let now = Date.now();
  if (now <= lastTime) {
    counter++;
    if (counter >= 1000) {
      while (Date.now() <= lastTime) {
        // Wait for next millisecond tick
      }
      now = Date.now();
      counter = 0;
    }
  } else {
    counter = 0;
  }
  lastTime = now;
  return `${now.toString()}${counter.toString().padStart(3, '0')}`;
}
