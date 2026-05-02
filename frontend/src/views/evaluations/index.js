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
import { Container } from 'react-bootstrap'
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
      <Container>
        <ErrorHandler>
          <Viewer latest={latest} edit={editMode} onEditMode={setEditMode} />
        </ErrorHandler>
      </Container>
    </Template>
  )
}

export default Evaluations
