export const featureTypes = {
  exam: 'exam',
  course: 'course'
}

/**
 * @param {{ isActive?: boolean, classes?: boolean }}
 * @returns {boolean}
 */
export function getClassTicket({ isActive, classes }) {
  return classes > 0 && isActive
}
