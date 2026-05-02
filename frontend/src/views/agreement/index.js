import React, {
  useMemo,
  useReducer,
  useEffect,
  useCallback,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Container } from 'react-bootstrap'
import { schedule } from 'common/module.schedule'
import { unwrapResult } from '@reduxjs/toolkit'
import { ToastsStore } from 'react-toasts'
import moment from 'moment'

import {
  ScheduleContainer,
  StreamingContainer,
  ButtonsContainer,
  ButtonContainer,
  Title
} from './styles'

import useAccess from 'hooks/useAccess'
import useCounter from 'hooks/useCounter'
import useHttpClient from 'hooks/useHttpClient'
import usePackages from 'hooks/usePackages'
import useSounds from 'hooks/useSounds'
import useSchedule from 'hooks/useSchedule'
import useToggler from 'hooks/useToggler'
import useLanguages from 'hooks/useLanguages'
import streamingReducer, { initialState } from './reducer'
import useUsers from 'hooks/useUsers'
import usePlans from 'hooks/usePlans'

import Animate from 'components/Animate'
import AptisButton from 'views/exams/components/Button'
import Schedule, { ScheduleContext } from 'components/Schedule'

import Picker from './components/Picker'
import CustomizeClass from './components/CustomizeClass'
import Template from 'components/Template'
import Primary from './components/Primary'
import Confirmation from './components/Confirmation'
import Payment from 'components/Payment'

import config from './config'
import PATH from 'utils/path'
import httpClient from 'utils/httpClient'
import { getFullName } from 'utils/functions'
import { setTeacher, setLang, setMeeting } from './actions'
import { getClassTicket } from 'utils/packages'

import { fetchSchedulesThunk } from 'store/@thunks/schedules'
import { fetchUsersThunk } from 'store/@thunks/users'
import { fetchLanguagesThunk } from 'store/@thunks/languages'

import roles from 'utils/roles'
import { withVerification as WV } from 'hocs'
import { createConfirmedClassThunk } from 'store/@thunks/classes'
import { select } from 'store/@reducers/plans'

const initialArguments = {
  search: '',
  page: 1
}

const Agreement = ({ history }) => {
  const { accesses } = useAccess()

  const { t } = useTranslation()

  const [state, dispatchToState] = useReducer(streamingReducer, initialState)

  const [modal, setModal] = useState(false)

  const [confirmation, setConfirmation] = useToggler()

  const [isNotFirstTime, setIsNotFirstTime] = useToggler()

  const [completed, setCompleted] = useToggler()

  const [loadingConfirmation, setLoadingConfirmation] = useToggler()

  const packages = usePackages()

  const plans = usePlans()

  const { count, update, isReached, isZero } = useCounter(
    config.counter.min,
    config.counter.max
  )

  const dispatchToStore = useDispatch()

  const date = useHttpClient(config.httpClient.date)

  const users = useUsers()

  const languages = useLanguages()

  const schedules = useSchedule()

  const sounds = useSounds()

  /**
   * @description
   * Fetching users
   */
  useEffect(() => {
    dispatchToStore(
      fetchUsersThunk({
        role: roles.TEACHER,
        ...initialArguments
      })
    )
      .then(unwrapResult)
      .then(({ response }) => {
        try {
          const [user] = response

          dispatchToState(
            setTeacher({
              ...user,
              fullName: getFullName(user.firstName, user.lastName)
            })
          )
        } catch (err) {
          console.error(err.name)
        }
      })
  }, [dispatchToStore])

  /**
   * @description
   * Fetching languages
   */
  useEffect(() => {
    dispatchToStore(fetchLanguagesThunk())
      .then(unwrapResult)
      .then(({ response }) => {
        try {
          const [language] = response

          dispatchToState(setLang(language))
        } catch (err) {
          console.log(err.name)
        }
      })
  }, [dispatchToStore])

  useEffect(() => {
    if (isReached) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      const langSelected = state.selection.language.id > 0

      const userSelected = state.selection.teacher.id > 0

      if (
        langSelected &&
        isNotFirstTime &&
        state.selection.language.code === 'es-US'
      ) {
        languages.data.forEach(language =>
          dispatchToStore(
            fetchSchedulesThunk({
              langId: language.id,
              push: true
            })
          )
        )
      } else {
        dispatchToStore(
          fetchSchedulesThunk({
            langId: state.selection.language.id
          })
        )
      }

      if (userSelected && isNotFirstTime) {
        dispatchToStore(
          fetchSchedulesThunk({
            userId: state.selection.teacher.id
          })
        )
      }
    }
  }, [
    isReached,
    isNotFirstTime,
    languages.data,
    state.selection.teacher,
    state.selection.language,
    dispatchToStore
  ])

  useEffect(() => {
    packages.fetchPackages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    plans.fetchPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * @description
   * Next view.
   */
  const handleCountIncrement = async () => {
    update.increment()

    sounds.play('click')
  }

  /**
   * @description
   * Previous view.
   */
  const handleCountDecrement = async () => {
    update.decrement()

    sounds.play('click')
  }

  const handleIsNotMyFirstTime = () => {
    setIsNotFirstTime()

    /**
     * @description
     * When is not his first time we need to put a new limit.
     */
    const defaultIsNotMyFirstTimeViewLimit = 1

    if (isNotFirstTime) {
      return update.limit(config.counter.max)
    }

    update.set(0)

    update.limit(defaultIsNotMyFirstTimeViewLimit)
  }

  /**
   * @param {User} teacher
   */
  const handleChangeTeacher = teacher => {
    dispatchToState(setTeacher(teacher))
  }

  /**
   * @param {ScheduleMeeting} meeting
   */
  const handleSelectMeeting = async meeting => {
    const active = packages.data.find(getClassTicket)

    if (active) {
      try {
        dispatchToState(setMeeting(meeting))

        return setConfirmation()
      } catch (err) {
        console.warn(err)
      }
    }

    const plan = plans.data.find(plan => plan.classes > 0)

    dispatchToStore(select(plan.name))

    setModal(true)
  }

  /**
   * @description
   * Confirmes that you want the class with that teacher.
   * @param {{ about?: string, level?: string }}
   */
  const handleClassConfirmation = async indications => {
    const { id } = packages.data.find(getClassTicket)

    const { defaultFormat } = schedule
    /**
     * @description
     * Moment of execution.
     */
    const {
      response: { now }
    } = await httpClient(config.httpClient.date)

    /**
     * @description
     * Before start confirmation class
     */
    const confirmationDate = moment(state.selection.meeting.startDate)
      .subtract(config.confirmationHourBeforeClassStart, 'hours')
      .format(defaultFormat)

    /**
     * @description
     * Also is in development mode we can confirm as well.
     * Is between 4 hours before and startDate we can confirm the class.
     */
    const isConfirmable =
      import.meta.env.DEV || moment(now).utc().isSameOrBefore(confirmationDate)

    ToastsStore.success('Confirmando clase...')

    if (isConfirmable) {
      setLoadingConfirmation()

      /**
       * @description
       * Creating a class instance with http request.
       */
      return dispatchToStore(
        createConfirmedClassThunk({
          indications: JSON.stringify(indications),
          packageId: id,
          scheduleId: state.selection.meeting.id
        })
      )
        .then(success => {
          console.debug(success)

          setCompleted(true)
        })
        .catch(err => {
          console.debug(err)

          setCompleted(false)
        })
        .finally(setLoadingConfirmation)
    }
    /**
     * @description
     * Because we can't take the class, we need to toggle state of confirmation.
     */
    setConfirmation()

    /**
     * @description
     * Preventing to re-creating.
     */

    sounds.play('ping')

    ToastsStore.error(t('AGREEMENT.anticipationWarning'))
  }

  /**
   * @param {Package} payment
   */
  const handleCompletedPayment = useCallback(() => {
    ToastsStore.success(t('AGREEMENT.purchase'))

    setModal(false)

    setConfirmation()
  }, [setConfirmation, t])

  const renderComponent = useMemo(() => {
    switch (count.value) {
      case 0:
        return (
          <Animate>
            <Primary />
          </Animate>
        )

      default:
        return <React.Fragment />
    }
  }, [count.value])

  const renderComponentWhenIsNotFirstTime = useMemo(() => {
    switch (count.value) {
      case 0:
        if (isNotFirstTime) {
          /**
           * @description
           * Transforming users into a mapeable users with fullName.
           */

          const userRef = users.data.map(user => ({
            ...user,
            fullName: getFullName(user.firstName, user.lastName)
          }))

          return (
            <Animate>
              <Picker
                data={userRef}
                description={t('AGREEMENT.PICKER.isNotFirstTime.description')}
                dropdownTextInfo={t('AGREEMENT.PICKER.option')}
                emoji="Teacher"
                JSXRenderingItem="fullName"
                onChange={handleChangeTeacher}
                pick={state.selection.teacher.fullName}
                subheader={t('AGREEMENT.PICKER.isNotFirstTime.subheader')}
                title={t('AGREEMENT.PICKER.title')}
              />
            </Animate>
          )
        }
        return <React.Fragment />

      default:
        return <React.Fragment />
    }
  }, [
    count.value,
    isNotFirstTime,
    state.selection.teacher.fullName,
    t,
    users.data
  ])

  if (modal) {
    return (
      <Template view>
        <Payment
          openWindow={modal}
          onCloseWindow={setModal}
          restrict={[accesses.CLASSES]}
          onPaymentRequest={handleCompletedPayment}
          defaultPaymentMethod={false}
          title={t('AGREEMENT.subscribe')}
        />
      </Template>
    )
  }

  if (completed) {
    return (
      <Template view withLoader={packages.loading}>
        <br /> <br />
        <Confirmation />
        <Container>
          <ButtonContainer float>
            <AptisButton onClick={() => history.push(PATH.DASHBOARD)}>
              Dashboard
            </AptisButton>
          </ButtonContainer>
        </Container>
      </Template>
    )
  }

  return (
    <Template
      withLoader={
        date.loading ||
        schedules.loading ||
        languages.loading ||
        packages.loading ||
        plans.loading
      }
      view
    >
      {isNotFirstTime ? (
        <>
          {isReached ? (
            <Animate>
              <StreamingContainer>
                <Title className="text-center">{t('AGREEMENT.title')}</Title>
              </StreamingContainer>
              {confirmation ? (
                <CustomizeClass
                  loading={loadingConfirmation}
                  levels={config.levels}
                  handleClassConfirmation={handleClassConfirmation}
                />
              ) : (
                <ScheduleContainer>
                  <ScheduleContext.Provider value={handleSelectMeeting}>
                    <Schedule
                      data={schedules.data}
                      editable={false}
                      onSelectMeeting={handleSelectMeeting}
                    />
                  </ScheduleContext.Provider>
                </ScheduleContainer>
              )}
            </Animate>
          ) : (
            <>
              <StreamingContainer>
                {renderComponentWhenIsNotFirstTime}
              </StreamingContainer>
              <ButtonsContainer>
                <AptisButton onClick={handleIsNotMyFirstTime}>
                  {t('AGREEMENT.back')}
                </AptisButton>
                <AptisButton onClick={handleCountIncrement}>
                  {t('AGREEMENT.next')}
                </AptisButton>
              </ButtonsContainer>
            </>
          )}
        </>
      ) : isReached ? (
        <>
          <Animate>
            {confirmation || (
              <StreamingContainer>
                <Title>{t('AGREEMENT.title')}</Title>
              </StreamingContainer>
            )}
            {confirmation ? (
              <CustomizeClass
                loading={loadingConfirmation}
                levels={config.levels}
                handleClassConfirmation={handleClassConfirmation}
              />
            ) : (
              <ScheduleContext.Provider value={handleSelectMeeting}>
                <Schedule
                  data={schedules.data}
                  date={date.data.now}
                  editable={false}
                  onSelectMeeting={handleSelectMeeting}
                />
              </ScheduleContext.Provider>
            )}
          </Animate>
        </>
      ) : (
        <React.Fragment>
          <StreamingContainer>{renderComponent}</StreamingContainer>
          <ButtonsContainer>
            <AptisButton
              className="mr-1"
              onClick={isZero ? handleIsNotMyFirstTime : handleCountDecrement}
            >
              <small>
                {isZero ? t('AGREEMENT.isNotMyFirstTime') : t('AGREEMENT.back')}
              </small>
            </AptisButton>
            <AptisButton onClick={handleCountIncrement}>
              <small>{t('AGREEMENT.next')}</small>
            </AptisButton>
          </ButtonsContainer>
        </React.Fragment>
      )}
    </Template>
  )
}

export default WV(Agreement)
