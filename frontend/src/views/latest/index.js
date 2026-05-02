import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'

import Template from 'components/Template'
import Viewer from 'views/evaluations/components/Viewer'

import useAsyncError from 'hooks/useAsyncError'
import useEvaluations from 'hooks/useEvaluations'
import useQuery from 'hooks/useQuery'
import useSounds from 'hooks/useSounds'

import PATH from 'utils/path'

const LatestEvaluation = () => {
  const { push } = useHistory()

  const { latest } = useQuery()

  const { id } = useParams()

  const { error, fetchEvaluation, loading } = useEvaluations({ latest })

  const sounds = useSounds()
  /**
   * @description
   * Fetching the remote resource.
   */
  useEffect(() => {
    fetchEvaluation({ id })
  }, [fetchEvaluation, id])

  /**
   * @description
   * Probably a http request error, so we need to push back to dashboard.
   */
  useAsyncError(() => {
    ToastsStore.warning('Unavailable Evaluation')

    sounds.play('ping')

    push({ pathname: PATH.DASHBOARD })
  }, error)

  return (
    <Template view withLoader={loading}>
      <Viewer latest={latest} />
    </Template>
  )
}

export default LatestEvaluation
