import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { billingCycleSelector, catalogSelector } from 'store/@selectors/plans'
import { fetchCatalogThunk } from 'store/@thunks/plans'
import { selectBillingCycle } from 'store/@reducers/plans'
import { initialArguments } from 'hooks'
import useModels from 'hooks/useModels'

/**
 * @typedef {Object} UsePricing
 * @property {import('@types/subscriptions').Plan[]} data  - plan catalog from backend
 * @property {boolean} loading
 * @property {string} selectedBillingCycle
 * @property {(cycle: string) => void} setBillingCycle
 * @property {() => () => void} fetchPricing
 */

/**
 * Exposes the plan catalog (GET /plans/catalog) and billing cycle state.
 * @param {{ preload?: boolean }} [opts]
 * @returns {UsePricing}
 */
function usePricing({ preload } = initialArguments) {
  const catalog = useSelector(catalogSelector)

  const selectedBillingCycle = useSelector(billingCycleSelector)

  const { model } = useModels()

  const dispatch = useDispatch()

  const setBillingCycle = useCallback(
    cycle => dispatch(selectBillingCycle(cycle)),
    [dispatch]
  )

  const fetchPricing = useCallback(() => {
    const args = model?.id ? { modelId: model.id } : {}
    const thunk = dispatch(fetchCatalogThunk(args))
    return () => {
      thunk.abort()
    }
  }, [dispatch, model])

  useEffect(() => {
    if (preload) {
      const args = model?.id ? { modelId: model.id } : {}
      const thunk = dispatch(fetchCatalogThunk(args))
      return () => {
        thunk.abort()
      }
    }
  }, [dispatch, model, preload])

  return {
    ...catalog,
    fetchPricing,
    selectedBillingCycle,
    setBillingCycle
  }
}

export default usePricing
