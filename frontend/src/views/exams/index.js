/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ToastsStore } from 'react-toasts'

import useQuery from 'hooks/useQuery'

import Template from 'components/Template'

import { fetchExamThunk } from 'store/@thunks/exams'
import path from 'utils/path'

const Exam = () => {
  const isMounted = useRef(true)

  const dispatch = useDispatch()

  const { push, goBack } = useHistory()

  const { index, query } = useQuery()

  const fetchCallback = () => {
    const category = decodeURIComponent(query)

   dispatch(fetchExamThunk({ id: index, category })).then(
      ({ meta, payload }) => {
        if (meta && meta.requestStatus === 'fulfilled') {
          isMounted.current && push({
            pathname: path.EXERCISES,
            state: {
              id: parseInt(index),
              context: category,
              preload: true
            }
          })
        /**
         * @description
         * Rejected is for an error.s
         */
        } else if (payload.failed || meta.requestStatus === 'rejected') {
          ToastsStore.error(
            'Ha ocurrido un problema intentando cargar el exámen'
          )
          /**
           * @description
           * Redirects to dashboard either.
           */
          isMounted.current && goBack()
        }
      }
    )

    return () => {
      isMounted.current = null
    }
  }

  useEffect(fetchCallback, [])

  return <Template withLoader />
}

export default Exam
