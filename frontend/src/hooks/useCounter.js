import { useState, useCallback, useMemo } from 'react'

/**
 *
 * @param {number} initialValue
 * @param {number} limit
 */
function useCounter(initialValue = 0, limit = Number.MAX_SAFE_INTEGER) {
  const [state, setState] = useState({
    value: initialValue,
    limit: limit
  })

  /**
   * @description
   * Updates the counter.
   * @returns {void}
   */
  const increment = useCallback(
    /**
     * @param {number} increaseBy
     */
    (increaseBy = 1) => {
      setState(prevState => {
        const increase = prevState.value + increaseBy

        if (increase >= prevState.limit) {
          return {
            ...prevState,
            value: prevState.limit
          }
        }
        return {
          ...prevState,
          value: increase
        }
      })
    },
    []
  )

  /**
   * @description
   * Updates the counter.
   * @returns {void}
   */
  const decrement = useCallback(
    /**
     * @param {number} decreaseBy
     */
    (decreaseBy = 1) => {
      setState(prevState => ({
        ...prevState,
        value: prevState.value - decreaseBy
      }))
    },
    []
  )

  const reset = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      value: 0
    }))
  }, [])

  const set = useCallback(
    /**
     * @param {number} value
     */
    value => {
      setState(prevState => ({
        ...prevState,
        value: value
      }))
    },
    []
  )

  /**
   * @alias ComputedProperty
   * @description
   * Assigns a memoized representation of fns.
   */
  const update = useMemo(
    () => ({
      increment,
      decrement,
      limit:
        /**
         * @param {number} value
         */
        value => {
          setState(prevState => ({
            ...prevState,
            limit: value
          }))
        },
      reset,
      set
    }),
    [increment, decrement, reset, set]
  )

  /**
   * @alias ComputedProperty
   * @description
   * Indicates if the value has exceed the limit or not.
   */
  const shouldNext = useMemo(() => state.value < state.limit, [
    state.value,
    state.limit
  ])

  const isZero = useMemo(() => state.value === 0, [state.value])

  const isReached = useMemo(
    () => state.limit !== 0 && state.value >= state.limit,
    [state.value, state.limit]
  )

  return { count: state, update, isReached, isZero, shouldNext }
}

export default useCounter
