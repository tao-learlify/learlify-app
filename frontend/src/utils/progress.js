/**
 * @param {number} current
 * @param {number} total
 * @param {number} percent
 */
export function calcProgress(current, total, percent = 100) {
  return (current / total) * percent
}
