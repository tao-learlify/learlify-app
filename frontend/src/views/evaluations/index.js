import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import useEvaluations from 'hooks/useEvaluations'
import useToggler from 'hooks/useToggler'

import Template from 'components/Template'
import Viewer from './components/Viewer'

import {
  fetchEvaluationThunk,
  fetchLatestThunk
} from 'store/@thunks/evaluations'
import useQuery from 'hooks/useQuery'
import ErrorHandler from 'views/errors'

const Evaluations = () => {
  const dispatchToStore = useDispatch()

  const [editMode, setEditMode] = useToggler()

  const { id } = useParams()

  const { latest } = useQuery()

  const evaluations = useEvaluations({ latest: Boolean(latest) })

  /**
   * @description
   * Fetching data
   */
  useEffect(() => {
    if (id) {
      const stream = latest
        ? dispatchToStore(fetchLatestThunk(id))
        : dispatchToStore(fetchEvaluationThunk(id))

      return () => {
        stream.abort()
      }
    }
  }, [dispatchToStore, id, latest])

  return (
    <Template withLoader={evaluations.loading}>
      <div className="container mx-auto px-4">
        <ErrorHandler>
          <Viewer latest={latest} edit={editMode} onEditMode={setEditMode} />
        </ErrorHandler>
      </div>
    </Template>
  )
}

export default Evaluations
