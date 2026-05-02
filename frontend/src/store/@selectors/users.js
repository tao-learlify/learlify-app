import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.users

export const usersSelector = createSelector(
  selector,
  ({ users }) => users
)

export const teachersSelector = createSelector(
  selector,
  ({ teachers }) => teachers
)