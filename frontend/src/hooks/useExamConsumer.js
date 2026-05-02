import { useContext } from 'react'

import { ExerciseContext, ExamContext } from 'store/context'


/**
 * @description
 * Returns a derived data for exam context.
 */
function useExamConsumer () {
  const state = useContext(ExamContext)

  const refs = useContext(ExerciseContext)
  
  return {
    ...state,
    ...refs,
  }
}

export default useExamConsumer