import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelingSubscriptionSelector } from 'store/@selectors/subscriptions'
import { cancelSubscriptionThunk } from 'store/@thunks/subscriptions'

/**
 * @typedef {Object} UseCancelSubscription
 * @property {boolean} loading
 * @property {*} error
 * @property {(subscriptionId: number, immediately?: boolean) => Promise<*>} cancel
 */

/**
 * Exposes the cancel subscription action and its async state.
 * On success, the subscriptions list is automatically refreshed via the thunk.
 * @returns {UseCancelSubscription}
 */
function useCancelSubscription() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(cancelingSubscriptionSelector)

  const cancel = useCallback(
    (subscriptionId, immediately = false) =>
      dispatch(cancelSubscriptionThunk({ subscriptionId, immediately })),
    [dispatch]
  )

  return { loading, error, cancel }
}

export default useCancelSubscription
