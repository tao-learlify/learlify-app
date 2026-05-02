import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { CORE, GRAMMAR, SPEAKING, WRITING } from 'constant/labels'

import useAuthProvider from 'hooks/useAuthProvider'
import useAccess from 'hooks/useAccess'
import useCategories from 'hooks/useCategories'
import useFeedback from 'hooks/useFeedback'
import useModels from 'hooks/useModels'
import useQuery from 'hooks/useQuery'
import useQueryValidation from 'hooks/useQueryValidation'
import useProgress from 'hooks/useProgress'
import usePlans from 'hooks/usePlans'
import useToggler from 'hooks/useToggler'

import Details from './components/Details'
import Flex from 'components/FlexContainer'
import Prevaluation from './components/Prevaluation'
import Payment from 'components/Payment'
import Template from 'components/Template'

import like from 'modules/words'
import { clearAsyncError, clearFeedbackSync } from 'store/@reducers/feedback'
import { patchProgressThunk, updateProgressThunk } from 'store/@thunks/exams'
import { fetchFeedbackThunk } from 'store/@thunks/feedback'

import PATH from 'utils/path'
import ErrorHandler from 'views/errors'
import { createNavigationPath } from 'modules/url'
import { unwrapResult } from '@reduxjs/toolkit'
import { clearProgressSync } from 'store/@reducers/exams'

/**
 * @description
 * Query parameteres required to run.
 */
const QUERY_PARAMETERS = ['id', 'context']
/**
 * @description
 * This view is handling the feedback user.
 */
const Feedback = () => {
  const user = useAuthProvider()

  const { t } = useTranslation()

  const { fetchPlans } = usePlans()

  const categories = useCategories()

  const dispatch = useDispatch()

  const feedback = useFeedback()

  const access = useAccess()

  const history = useHistory()

  const location = useLocation()

  const query = useQuery()

  const progress = useProgress()

  const { model, data } = useModels()

  const [paymentWindow, setPaymentWindow] = useToggler()

  const ref = useRef(null)

  const render = useRef(null)

  useEffect(() => {
    return () => {
      location.state = {}

      dispatch(clearFeedbackSync())
      dispatch(clearProgressSync())
    }
  }, [dispatch, history, location])

  useEffect(() => {
    const category = categories.data.find(current =>
      like(
        [current.name],
        query.context.includes(GRAMMAR) ? CORE : query.context
      )
    )

    if (
      category &&
      data.length > 0 &&
      render.current === null &&
      !progress.synchronizing
    ) {
      const name = model.name

      render.current = true

      ref.current = category.name

      dispatch(
        fetchFeedbackThunk({
          categoryId: category.id,
          examId: query.id,
          model: name,
          ignore: location.state && location.state.ignore
        })
      ).then(unwrapResult)
    }
  }, [
    categories.data,
    data.length,
    dispatch,
    location.state,
    model,
    progress.synchronizing,
    query
  ])

  /**
   * @description
   * If requires payment we pop-up a modal with some requirements to access to feedback user.
   * That comes with the "cache" request inside redux store.
   */
  useEffect(() => {
    if (
      (feedback.error && feedback.error.requiresPayment) ||
      (progress.error && progress.error.requiresPayment)
    ) {
      /**
       * @description
       * If requiresPayment should fetch plSans for using in the context.
       */
      fetchPlans()

      /**
       * @description
       * Open window for render window.
       */
      setPaymentWindow(true)

      /**
       * @description
       * Clearing error.
       */
      dispatch(clearAsyncError())
    }

    if (feedback.error && feedback.error.notFound) {
      const route = createNavigationPath(PATH.EXAMS, {
        index: query.id,
        query: query.context
      })

      history.push(route, {})
    }
  }, [
    dispatch,
    feedback.error,
    fetchPlans,
    query,
    progress.error,
    setPaymentWindow,
    history
  ])

  useQueryValidation(
    {
      required: QUERY_PARAMETERS
    },
    exception => {
      if (exception) {
        ToastsStore.warning('Los parámetros son inválidos')

        history.push({
          pathname: '/',
          state: {}
        })
      }
    }
  )

  /**
   * @description
   * Exams push through location state a property called "download" if there's no property.
   * We should dispatch a clear async error to redux store and push to dashboard.
   */
  useEffect(() => {
    if (location.state && location.state.download === undefined) {
      history.push(PATH.DASHBOARD, {})

      dispatch(clearAsyncError())
    }
  }, [dispatch, history, location.state])

  /**
   * @description
   * Restarts the progress of the current exam.
   */
  const handleClickOnTryAgain = () => {
    try {
      const { category, exam } = feedback.data.stats

      const route = createNavigationPath(PATH.EXAMS, {
        query: category.name,
        index: exam.id
      })

      dispatch(
        patchProgressThunk({
          category: category.name,
          id: feedback.data.id
        })
      )
        .then(() => history.push(route, {}))
        .catch(() => ToastsStore.warning('Ha ocurrido un error inesperado'))
    } catch (err) {
      const { category, exam } = feedback.data.evaluation

      const route = createNavigationPath(PATH.EXAMS, {
        query: category.name,
        index: exam.id
      })

      dispatch(
        patchProgressThunk({
          category: category.name,
          id: feedback.data.id
        })
      )
        .then(() => history.push(route, {}))
        .catch(() => ToastsStore.warning('Ha ocurrido un error inesperado'))
    }
  }

  /**
   * @description
   * When closes payment method returns to the dashboard.
   */
  const handleRedirectDashboard = () => {
    history.push({
      pathname: PATH.DASHBOARD,
      state: {}
    })
  }

  /**
   * @description
   * Update the current progress with a cache request.
   */
  const handleUploadSyncCachedWithRequest = () => {
    dispatch(updateProgressThunk(progress.cache))
      .then(unwrapResult)
      .then(() =>
        history.push(
          createNavigationPath(PATH.EXAMS, {
            index: query.id,
            query: query.context
          })
        )
      )
      .catch(err => console.log(err.message))
  }

  const handleClickDashboard = () => {
    history.push(PATH.DASHBOARD)
  }

  return (
    <ErrorHandler>
      <Template
        withLoader={
          categories.loading || feedback.loading || progress.synchronizing
        }
        view
      >
        {paymentWindow ? (
          <Payment
            defaultPaymentMethod={false}
            onCloseWindow={handleRedirectDashboard}
            openWindow
            restrict={[access.accesses.EXAMS, access.accesses.EVALAUTIONS]}
            onPaymentRequest={handleUploadSyncCachedWithRequest}
          />
        ) : feedback.data && ref.current ? (
          ref.current === SPEAKING || ref.current === WRITING ? (
            <>
              <Prevaluation label={ref.current} />
              <br />
              <Flex>
                <Button variant="secondary" onClick={handleClickOnTryAgain}>
                  {t('FEEDBACK.tryAgain')}
                </Button>
              </Flex>
              <br />
              <Flex>
                <Button variant="secondary" onClick={handleClickDashboard}>
                  {t('FEEDBACK.dashboard')}
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Details />
              <br />
              <Flex>
                <Button variant="secondary" onClick={handleClickOnTryAgain}>
                  {t('FEEDBACK.tryAgain')}
                </Button>
              </Flex>
              <br />
              <Flex>
                <Button variant="secondary" onClick={handleClickDashboard}>
                  {t('FEEDBACK.dashboard')}
                </Button>
              </Flex>
            </>
          )
        ) : (
          <React.Fragment />
        )}
        <br />
      </Template>
    </ErrorHandler>
  )
}

export default Feedback
