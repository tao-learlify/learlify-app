import { createAction } from '@reduxjs/toolkit'

/**
 * @description
 * This will clear all persistent errors from reducers.
 */
export const clearAsyncError = createAction('@reducers/clearAsyncError')