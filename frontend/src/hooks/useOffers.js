import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOffersThunk } from 'store/@thunks/plans'
import { offersSelector } from 'store/@selectors/plans'
import { initialArguments } from 'hooks'

import useModels from './useModels'

function useOffers({ preload } = initialArguments) {
  const { model } = useModels()

  const offers = useSelector(offersSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    if (preload) {
      const stream = dispatch(fetchOffersThunk())

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, preload])

  const fetchOffers = useCallback(() => {
    if (model) {
      const stream = dispatch(
        fetchOffersThunk({
          model: model.name
        })
      )

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, model])

  return {
    ...offers,
    fetchOffers
  }
}

export default useOffers
