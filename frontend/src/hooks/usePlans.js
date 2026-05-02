import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { plansSelector } from 'store/@selectors/plans'
import { fetchPlansThunk } from 'store/@thunks/plans'
import { initialArguments } from 'hooks'
import useModels from './useModels'

/**
 * @typedef {Object} UsePlans
 * @property {Array<Plan>} actives
 * @property {Array<Plan>} plans
 * @property {boolean} loading
 */

/**
 * @example
 * const { plans, loading } = usePlans()
 *
 * return plans.map(...statements)
 * @param {useBackendService}
 * @returns {UsePlans}
 */
function usePlans({ preload } = initialArguments) {
  const { model } = useModels()

  const plans = useSelector(plansSelector)

  const dispatch = useDispatch()

  const fetchPlans = useCallback(() => {
    if (model) {
      const plans = dispatch(
        fetchPlansThunk({
          model: model.name
        })
      )

      return () => {
        plans.abort()
      }
    }
  }, [dispatch, model])

  useEffect(() => {
    if (preload && model) {
      const plans = dispatch(fetchPlansThunk({ model: model.name }))

      return () => {
        plans.abort()
      }
    }
  }, [dispatch, model, preload])

  return {
    ...plans,
    fetchPlans
  }
}

export default usePlans
