import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchEvaluationsThunk,
  fetchEvaluationThunk,
  fetchLatestEvaluationsThunk,
  fetchLatestThunk
} from 'store/@thunks/evaluations'
import {
  evaluationSelector,
  ownsSelector,
  latestEvaluationsSelector,
  countSelector
} from 'store/@selectors/evaluations'
import { initialArguments } from 'hooks'

import useModels from 'hooks/useModels'

/**
 * @returns {import ('store/@reducers/evaluations').EvaluationState}
 */
function useEvaluations({ preload, owns, latest, count } = initialArguments) {
  const { model } = useModels()

  const evaluations = useSelector(
    latest
      ? latestEvaluationsSelector
      : owns
      ? ownsSelector
      : count
      ? countSelector
      : evaluationSelector
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (preload) {
      const stream = !latest
        ? dispatch(fetchEvaluationsThunk())
        : dispatch(fetchLatestEvaluationsThunk(1))

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, preload, latest])

  const fetchEvaluations = useCallback(
    ({ page, own } = { page: null, own: false }) => {
      if (latest && model) {
        dispatch(
          fetchLatestEvaluationsThunk({
            modelId: model.id,
            page,
            own
          })
        )
      } else if (model) {
        dispatch(
          fetchEvaluationsThunk({
            modelId: model.id,
            page,
            own
          })
        )
      }
    },
    [dispatch, latest, model]
  )

  /**
   * @param {{ id: number }}
   */
  const fetchEvaluation = useCallback(
    ({ id }) => {
      dispatch(latest ? fetchLatestThunk(id) : fetchEvaluationThunk(id))
    },
    [dispatch, latest]
  )

  return {
    ...evaluations,
    fetchEvaluations,
    fetchEvaluation
  }
}

export default useEvaluations
