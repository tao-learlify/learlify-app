import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatsThunk } from 'store/@thunks/stats'
import { statsSelector } from 'store/@selectors/stats'
import { initialArguments } from 'hooks'

import useModels from 'hooks/useModels'

function useStats({ preload } = initialArguments) {
  const stats = useSelector(statsSelector)

  const { model } = useModels()


  const dispatch = useDispatch()

  useEffect(() => {
    if (preload && model) {
      const stream = dispatch(fetchStatsThunk(model))

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, model, preload])

  const fetchData = useCallback(() => {
    if (model) {
      const stream = dispatch(fetchStatsThunk(model))

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, model])

  return {
    ...stats,
    fetchStats: fetchData
  }
}

export default useStats
