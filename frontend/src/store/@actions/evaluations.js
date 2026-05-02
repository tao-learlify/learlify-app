import { createAction } from '@reduxjs/toolkit'

/**
 * @description
 * Update one evaluation.
 */
export const updateEvaluation = createAction('evaluations/update')

/**
 * @description
 * Fetch latest evaluations.
 */
export const fetchLatestEvaluations = createAction('evaluations/fetchLatestEvaluations')