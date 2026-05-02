import { useCallback, useEffect } from 'react'
import { initialArguments } from 'hooks'
import { useDispatch, useSelector } from 'react-redux'
import { examsSelector } from 'store/@selectors/exams'
import { fetchExamsThunk } from 'store/@thunks/exams'

import useModels from './useModels'

/**
 * @typedef {Object} UseExamsHook
 * @property {boolean} loading
 * @property {[]} data
 */

/**
 * @param {useBackendService}
 * @returns {UseExamsHook}
 */
function useExams({ preload } = initialArguments) {
  const dispatch = useDispatch()

  const exams = useSelector(examsSelector)

  const { model } = useModels()


  const fetchExams = useCallback(() => {
    if (model) {
      /**
       * @description
       * Fetch exams based on model.
       */
      const stream = dispatch(fetchExamsThunk(model.name))

      return () => {
        stream.abort()
      }
    }
  }, [model, dispatch])


  useEffect(() => {
    if (model && preload) {
      /**
       * @description
       * Fetch exams based on model.
       */
      const stream = dispatch(fetchExamsThunk(model.name))

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, model, preload])

  return {
    ...exams,
    fetchExams
  }
}

export default useExams
