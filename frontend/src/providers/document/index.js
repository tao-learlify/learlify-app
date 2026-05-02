/**
 * @param {number} value 
 */
export function updateDocumentTitleWithNotification (value, title = document.title) {
  if (value > 0) {
    document.title = `(${value}) ${title}`

    return document.title
  }
  
  document.title = title
}