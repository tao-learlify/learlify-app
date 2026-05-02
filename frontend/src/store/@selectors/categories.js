import { createSelector } from '@reduxjs/toolkit'
import { CORE } from 'constant/labels'
import { IELTS } from 'constant/models'


const hook = state => [state.models, state.categories, state.courses]

/**
 * @description
 * IELTS doesn't include CORE category.
 */
function getCategoriesContext(model, categories, courses) {
  if (model && model.name && courses.data.length === 0) {
    switch (model.name) {
      case IELTS:
        return {
          ...categories,
          data: categories.data.filter(
            category => !category.name.includes(CORE)
          )
        }

      default:
        return categories
    }
  }
  return categories
}

/**
 * @description
 * Filtering caltegories by model.
 */
export const categoriesSelector = createSelector(
  hook,
  ([{ models }, { categories }, { courses }]) =>
    getCategoriesContext(models.selected, categories, courses)
)
