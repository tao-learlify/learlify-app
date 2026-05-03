/**
 * @description
 * Creates a instant url path navigation with parameters.
 * @param {string} path
 * @param {{}} history 
 * 
 * @example
 * createNavigationPath('/billing', { stats: true }) => '/billing?stats=true'
 */
export const createNavigationPath = (path, history) => {
  const url = new URLSearchParams()

  Object.keys(history).forEach(key => {
    url.append(key, history[key.toLowerCase()])
  })

  return `${path}?${url.toString()}`
}