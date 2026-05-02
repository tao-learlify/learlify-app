import { useSelector } from 'react-redux'
import { categoriesSelector } from 'store/@selectors/categories'

/**
 * @returns {import ('store/@reducers/categories').CategoryEntity}
 */
function useCategories () {
  return useSelector(categoriesSelector)
}

export default useCategories
