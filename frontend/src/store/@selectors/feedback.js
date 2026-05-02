import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.feedback

/**
 * @param {string} label
 */
export const feedbackSelector = createSelector(selector, ({ exams }) => exams)
