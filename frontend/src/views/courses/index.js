/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { ToastsStore } from 'react-toasts'
import { compose } from 'redux'
import Confetti from 'react-confetti'

import api from 'api'

import useAccess from 'hooks/useAccess'
import useAdvance from 'hooks/useAdvance'
import useCounter from 'hooks/useCounter'
import useCourses from 'hooks/useCourses'
import useModels from 'hooks/useModels'
import useToggler from 'hooks/useToggler'
import usePlans from 'hooks/usePlans'
import useSounds from 'hooks/useSounds'
import useQuery from 'hooks/useQuery'
import useWindowSize from 'hooks/useWindowSize'

import Content from './components/Content'
import ErrorHandler from 'views/errors'
import FallbackMode from 'components/FallbackMode'
import Payment from 'components/Payment'
import Template from 'components/Template'
import Preview from './components/Preview'

import preloadState, {
  initialState,
  setDownload,
  setUnit,
  setSection,
  setPreselection,
  setModules,
  setIncreaseLevel,
  setRecord,
  setConfetti,
  setFeedback,
  setUpdate,
  setError,
  setLevelSelection
} from 'state/exercise'

import { createAdvanceThunk, fetchCoursesThunk } from 'store/@thunks/courses'
import { getAdvance, getResponseCallback } from './utils'
import { withModels, withVerification } from 'hocs'

import { ExamContext, ExerciseContext } from 'store/context'

import like from 'modules/words'
import modules, { handleContextSelection } from 'modules/exercises'
import { validationGeneral } from 'modules/validation'
import { unmountCoursesProcess, updateLocalUnit } from 'store/@reducers/courses'

const Courses = () => {
  const dispatchToStore = useDispatch()

  const ref = useRef()

  const access = useAccess()

  const advance = useAdvance()

  const sounds = useSounds()

  const plans = usePlans()

  const { demo } = useQuery()

  const [height, width] = useWindowSize()

  const [exercise, setExercise] = useState()

  const [checkStatus, setCheckStatus] = useToggler()

  const [demoStatus, setDemoStatus] = useToggler()

  const [downloadingState, setDownloadState] = useToggler()

  const [paymentModeState, setPaymentModeState] = useToggler()

  const [paymentCheckpointState, setPaymentCheckpointState] = useToggler()

  const [state, dispatch] = useReducer(preloadState, initialState)

  const { loading, data } = useCourses()

  const { model } = useModels()

  const { count, update, isReached } = useCounter(0, 0)

  const i18next = useTranslation()

  useEffect(() => {
    if (demo) {
      setDemoStatus()
    }

    return () => {
      dispatchToStore(unmountCoursesProcess())
    }
  }, [demo, setDemoStatus, dispatchToStore])

  useEffect(() => {
    if (isReached) {
      dispatchToStore(
        updateLocalUnit({
          unit: state.unit + 1
        })
      )
    }
  }, [isReached, dispatchToStore, state.unit])

  /**
   * @description
   * When this function is triggered, will render another exercise and this will check his current structure.
   * First of all, we check if the actual value is an exercise, and will check if questions are right there.
   * If not, will check if there any "modules" tag, modules render differently, so, we need to create an array with his current structure.
   */
  const updateWhenCountChanges = useCallback(() => {
    if (
      state.section.length > 0 &&
      state.section[count.value] &&
      state.section[count.value].exercise
    ) {
      const exercise = state.section[count.value].exercise

      if (exercise) {
        setExercise(exercise)

        if ('questions' in exercise) {
          const questions = exercise.questions.length

          dispatch(setPreselection(questions))
        }

        if ('modules' in exercise) {
          const levels = exercise.modules.length - 1

          /**
           * Transform questions into "modules" in the current process.
           * @param {[]} data
           * @param {{}} context
           * @returns  {string []}
           */
          const fillWithModularization = (data, context) => {
            const translatePick = i18next.t('ALL.PICK')

            return Array(data.length).fill(
              context === modules.DROPDOWN ? i18next.t(translatePick) : ''
            )
          }
          /**
           * @description
           * Creates a context which a partial state should be stable.
           */
          const context = exercise.modules.map(({ questions, ...data }) => ({
            selections: fillWithModularization(questions, data.module)
          }))
          /**
           * @description
           * Set module configuration when it required.
           */
          dispatch(
            setModules({
              context,
              level: 0,
              levels
            })
          )
        }
      }
    }
  }, [count.value, i18next, state.section])

  /**
   * @description
   * If requires payment only will do this action.
   */
  const getErrorStatusCallback = async error => {
    if (error.requiresPayment) {
      await plans.fetchPlans()

      setPaymentCheckpointState(true)
    }
  }

  /**
   * @description
   * Fetching courses and advance
   * If advance not found setCheckStatus will not triggered.
   */
  useEffect(() => {
    const demoApply = demo || demoStatus
    const modelName = model?.name || model?.model

    if (!modelName || typeof modelName !== 'string' || modelName.startsWith('[object')) return

    dispatchToStore(
      fetchCoursesThunk({
        model: modelName,
        demo: demo || demoStatus
      })
    )
      .then(unwrapResult)
      .then(thunk => getResponseCallback(thunk, demoApply, setCheckStatus))
      .catch(getErrorStatusCallback)
  }, [
    demo,
    demoStatus,
    dispatchToStore,
    model?.name,
    model?.model,
    plans.fetchPlans,
    setCheckStatus,
    setPaymentModeState
  ])

  /**
   * @description
   * If setCheckStatus is triggered will download course from bucket to load data from the aws.
   */
  useEffect(() => {
    const downloadCourseOnBrowser = async () => {
      try {
        const [course] = data

        if (course) {
          setDownloadState(true)

          const download = await api.courses.fetchCourse(course.views.url)

          dispatch(setDownload(download))

          /**
           * @description
           * If data exist, we need to load the previous progress on the current unit.
           */
          if (advance.data) {
            const [properties] = advance.data

            const context = getAdvance(properties)

            if (context.unit || context.unit === initialUnit) {
              const range = context.props.general

              update.set(range)

              dispatch(setUnit(context.unit))
            } else {
              dispatch(setUnit(initialUnit))
            }
          }
        }
      } finally {
        setDownloadState(false)
      }
    }

    if (checkStatus || demo) {
      downloadCourseOnBrowser()
    }
  }, [advance.data, checkStatus, data, demo, setDownloadState, update])

  useEffect(() => {
    async function downloadUnit() {
      try {
        if (state.unit === initialUnit || state.unit) {
          /**
           * @type {number}
           */
          const unit = state.unit

          dispatch(setError(null))

          setDownloadState(true)

          /**
           * @type {[]}
           */
          const { sections } = await api.courses.fetchCourse(
            state.download[unit]
          )

          const key = 'exercise'
          /**
           * @description
           * Making the correct data structure for our pattern
           */
          const flattenSectionContent = sections
            .map(section =>
              section.content.map(data => ({ ...data, category: section.type }))
            )
            .flat()

          update.limit(flattenSectionContent.length)

          /**
           * @description
           * Setting sections from the cloud resource
           */
          dispatch(setSection(flattenSectionContent))

          /**
           * @description
           * Saving to refs to optimize renders
           */
          if (ref.current && ref.current.continue) {
            const updateToIndex = flattenSectionContent.findIndex(section =>
              like([section.category], ref.current.category)
            )

            ref.current = undefined

            update.set(updateToIndex)
          }

          if (advance.data.length > initialUnit) {
            const [properties] = advance.data

            const context = getAdvance(properties)

            if (context.unit) {
              const range = context.props.general

              if (
                flattenSectionContent[range] &&
                key in flattenSectionContent[range]
              ) {
                setExercise(flattenSectionContent[range][key])
              }
            }
          } else {
            /**
             * Setting initial exercise or theory, because we can't handle data.
             */
            setExercise(flattenSectionContent[initialUnit][key])
          }
        }
      } catch (err) {
        dispatch(setError(err))
      } finally {
        setDownloadState(false)
      }
    }

    downloadUnit()
  }, [state.unit, state.download, update, advance.data, setDownloadState])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateWhenCountChanges, [count.value, state.section])

  /**
   * @param {number} unit
   * @param {string} category
   */
  const handleSelectUnit = useCallback(
    (unit, category) => {
      /**
       * @description
       * Only will render another exercise instead of re-rendering unit, because is the same unit.
       */
      if (state.unit === unit) {
        const updateToIndex = state.section.findIndex(section =>
          like([section.category], category)
        )

        return update.set(updateToIndex)
      }

      ref.current = {
        continue: true,
        category
      }

      dispatch(setUnit(unit))
    },
    [state.section, state.unit, update]
  )

  /**
   * @param {boolean | object} push
   * @returns {Promise<void>}
   */
  const handleUpdateAdvance = async push => {
    if (push === null) {
      return update.increment()
    }

    if (typeof push === 'object' && push.back) {
      dispatch(setUpdate())

      update.decrement()

      try {
        const [course] = data

        const advanceUpdate = {
          courseId: course.id,
          last: push ? count.value - 1 : count.value - 1,
          unit: state.unit + 1
        }

        return await api.courses.updateAdvance(advanceUpdate)
      } catch (err) {
        return console.debug(err)
      }
    }

    if (state.next || (typeof push === 'object' && push.next)) {
      dispatch(setUpdate())

      setExercise()

      update.increment()

      try {
        const [course] = data

        const advanceUpdate = {
          completed: push ? count.value + 1 === count.limit : false,
          courseId: course.id,
          last: push ? count.value + 1 : count.value - 1,
          unit: state.unit + 1
        }

        return await api.courses.updateAdvance(advanceUpdate)
      } catch (err) {
        return console.debug(err)
      }
    }

    /**
     * @see module
     * @description
     * Here is where the validation appears and should check how an exercise is evaluated.
     */
    validationGeneral(
      {
        exercise,
        state
      },
      async ({ automatic, error, message, mode, feedback }) => {
        /**
         * @description
         * If error is presented should throw an info message with Toast.
         */
        if (error) {
          sounds.play('ping')

          return ToastsStore.info(message)
        }

        mode &&
          mode === 'single' &&
          sounds.play(feedback.isValid ? 'complete' : 'incomplete')
        /**
         * @description
         * Feedback automatic means for speaking and writing confetti.
         */
        automatic && dispatch(setConfetti())

        /**
         * @description
         * This mean validations was successfully corrected.
         * Now comes with the feedback, this dispatch will alternate the UI.
         */
        dispatch(
          setFeedback({
            feedback,
            mode
          })
        )
      },
      []
    )
  }
  /**
   * @description
   * Checking how an exercise should be sync in the local state.
   */
  const handleSelection = useCallback(
    selection => {
      const action = handleContextSelection(exercise.label)

      action && dispatch(action(selection))
    },
    [exercise]
  )

  /**
   * @description
   * This only works for modules.
   * @param {number} level
   */
  const handleLevelUpdate = (level = 1) => {
    dispatch(setIncreaseLevel(level))
  }

  /**
   * @description
   * This handles any user voice recording.
   * @param {Blob} record
   */
  const handleRecording = record => {
    dispatch(setRecord(record))
  }

  /**
   * @description
   * Start fetching plans and the user should check what he need.
   */
  const handleStartCourse = async () => {
    try {
      await plans.fetchPlans()

      setPaymentModeState()
    } catch (err) {
      ToastsStore.warning(err.name)
    }
  }

  /**
   * @description
   * Processing inscription
   */
  const handlePaymentCourse = async () => {
    const [course] = data

    const inscriptionMessage = i18next.t('COURSES.inscription')

    if (paymentCheckpointState) {
      return window.location.reload()
    }

    ToastsStore.info(inscriptionMessage)

    /**
     * @description
     * Creating advance on this course as soon is possible.
     */
    dispatchToStore(
      createAdvanceThunk({
        courseId: course.id
      })
    )
      .then(setPaymentModeState)
      .then(setCheckStatus)
  }

  /**
   * @description
   * Handling next unit with advance, if demoStatus is presented we will handling checkTextStatus.
   * @returns {Promise<void>}
   */
  const handleNextUnit = async () => {
    if (demo || demoStatus) {
      await plans.fetchPlans()

      return setPaymentModeState()
    }

    update.set(0)

    dispatch(setUnit(state.unit + 1))
  }

  const handleTryAgain = async () => {
    const [course] = data

    update.reset()

    await api.courses.updateAdvance({
      unit: state.unit + 1,
      completed: false,
      courseId: course.id,
      last: 0
    })
  }

  const increaseLevel = useCallback(() => {
    const level = state.data.level + 1

    handleLevelUpdate(level)
  }, [state.data.level])

  const decreaseLevel = useCallback(() => {
    const level = state.data.level - 1

    handleLevelUpdate(level)
  }, [state.data.level])

  const setDemoStatusOnContent = () => {
    setDemoStatus(true)
  }

  /**
   * @description
   * Computed provider, can handling recording audio, selections, modules selection, back, nexts and so on.
   */
  const provider = useMemo(
    () => ({
      exercise,
      handleRecording,
      handleSelection,
      handleLevelSelection: selection => dispatch(setLevelSelection(selection)),
      handleBack: () => update.decrement(),
      handleNext: () => update.increment(),
      handleLevelUpdate,
      handleSelectUnit,
      increaseLevel,
      decreaseLevel
    }),
    [
      decreaseLevel,
      exercise,
      handleSelectUnit,
      handleSelection,
      increaseLevel,
      update
    ]
  )

  if (loading) {
    return <FallbackMode />
  }

  if (paymentModeState || paymentCheckpointState) {
    return (
      <Template view withLoader={plans.loading || advance.loading}>
        <Payment
          defaultPaymentMethod={false}
          title={i18next.t('COURSES.title')}
          restrict={[access.accesses.COURSES]}
          onPaymentRequest={handlePaymentCourse}
        />
      </Template>
    )
  }

  return (
    <>
      {checkStatus || demoStatus ? (
        <ErrorHandler>
          <ExamContext.Provider value={state}>
            <ExerciseContext.Provider value={provider}>
              <Content
                completed={isReached}
                current={count.value}
                demo={demoStatus}
                loading={downloadingState}
                onUpdate={handleUpdateAdvance}
                onNextUnit={handleNextUnit}
                onTryAgain={handleTryAgain}
                total={count.limit}
              />
            </ExerciseContext.Provider>
          </ExamContext.Provider>
          {state.allowConfetti && (
            <Confetti width={width / 1} height={height / 1} />
          )}
        </ErrorHandler>
      ) : (
        <>
          <Template view>
            <Preview
              onStart={handleStartCourse}
              onDemo={setDemoStatusOnContent}
            />
          </Template>
        </>
      )}
    </>
  )
}

const initialUnit = 0

export default compose(withVerification, withModels)(Courses)
