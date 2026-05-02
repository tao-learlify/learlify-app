import React, {  useCallback, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { TOAST_EXPIRATION } from 'constant'

import useSounds from 'hooks/useSounds'
import useQuery from 'hooks/useQuery'

import Template from 'components/Template'
import Assessment from 'components/Assessment'

import path from 'utils/path'
import httpClient from 'utils/httpClient'
import useHttpClient from 'hooks/useHttpClient'

/**
 * @description
 * In this view we can assign a valoration of the previous meeting.
 */

const defaultAssessment = [
  {
    description: '¿Cómo valorarías esta llamada?',
    initial: 0,
    range: 4
  },
  {
    description: '¿Qué tal tu profesor?',
    initial: 0,
    range: 4
  }
]

const Quality = () => {
  const query = useQuery()

  const location = useLocation()

  const history = useHistory()

  const sounds = useSounds()

  const request = useHttpClient({
    endpoint: '/api/v1/classes',
    queries: {
      name: query.token,
      info: true
    },
    requiresAuth: true,
    timezone: true
  })

  useEffect(() => {
    const isFeedback = Object(location.state).hasOwnProperty('feedback')

    if (isFeedback) {
      sounds.play('ping')
    } else {
      history.push(path.DASHBOARD)
    }
  }, [history, location.state, sounds])

  /**
   * @description
   * Closes and redirect to the current dashboard.
   */
  const onCloseAssessment = () => {
    history.replace({
      pathname: path.DASHBOARD,
      state: {}
    })
  }

  /**
   * @description
   * Handle calification, and sends to the mail.
   */
  const onHandleAssessment = useCallback(
    async assessment => {
      try {
        await httpClient({
          body: assessment,
          endpoint: '/api/v1/report/quality',
          queries: {
            teacher: request.data.id
          },
          method: 'POST',
          requiresAuth: true
        })

        ToastsStore.success('Gracias por calificar!', TOAST_EXPIRATION)

        history.replace({
          pathname: path.DASHBOARD,
          state: {}
        })
      } catch (err) {
        history.replace({
          pathname: path.DASHBOARD,
          state: {}
        })

        ToastsStore.warning(
          'Hubo un problema para calificar la llamada',
          TOAST_EXPIRATION
        )
      }
    },
    [history, request.data]
  )

  return (
    <Template withSocket={false} withLoader={request.loading}>
      {request.fetch && (
        <Assessment
          enabled
          values={defaultAssessment}
          onClose={onCloseAssessment}
          onCalification={onHandleAssessment}
        />
      )}
    </Template>
  )
}

export default Quality