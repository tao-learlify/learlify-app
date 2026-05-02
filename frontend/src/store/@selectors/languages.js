import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.languages

export const languagesSelector = createSelector(
  selector,
  languages => languages
)