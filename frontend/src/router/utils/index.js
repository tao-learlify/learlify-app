/**
 * @param {string} route
 * @param {string []} params 
 */
export default function addParameters (route, params) {
  params.forEach(param => {
    route = `${route}/:${param}`
  })

  return route
}