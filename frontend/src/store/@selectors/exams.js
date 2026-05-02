import { createSelector } from '@reduxjs/toolkit'

const hook = state => state.exams

export const examsSelector = createSelector(hook, ({ exams }) => exams)

export const progressSelector = createSelector(hook, ({ progress }) => progress)

/**
 * @param {number} index
 */
export const selectIndexWithSelector = index => {
  return createSelector(hook, ({ exams: { instance } }) => {
    const data = instance && instance[index]

    return {
      exercise: data,
      limit: instance ? instance.length : 0,
    }
  })
}
