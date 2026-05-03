/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'
import Confetti from 'react-confetti'
import 'assets/css/core.css'

import useCategories from 'hooks/useCategories'
import useCounter from 'hooks/useCounter'
import useModels from 'hooks/useModels'
import useProgress from 'hooks/useProgress'
import useSounds from 'hooks/useSounds'
import useToggler from 'hooks/useToggler'
import useWindowSize from 'hooks/useWindowSize'

import AptisButton from './components/Button'
import Picker from './components/Picker'
import ExamLayout from 'components/ExamLayout'
import FlexContainer from 'components/FlexContainer'
import ErrorHandler from 'views/errors'
import Footer from 'components/Footer'
import OverlayMessage from 'components/OverlayMessage'
import Module from 'components/Module'
import Template from 'components/Template'
import Feedback from 'components/Feedback'
import Report from 'components/Report'
import Section from 'components/Section'

import dynamic, { handleContextSelection } from 'modules/exercises'

import exerciseReducer, {
  initialState,
  setScore,
  setFeedback,
  setUpdate,
  setRecord,
  setConfetti,
  setPreselection,
  setModules,
  setIncreaseLevel,
  setLevelSelection
} from 'state/exercise'
import { selectIndexWithSelector } from 'store/@selectors/exams'

import {
  createProgressThunk,
  fetchProgressThunk,
  updateProgressThunk
} from 'store/@thunks/exams'
import { ExamContext, ExerciseContext } from 'store/context'

import path from 'utils/path'

import { SPEAKING, WRITING } from 'constant/labels'
import { validationGeneral } from 'modules/validation'

import getScore from 'modules/score'
import like from 'modules/words'

import styles from './exams.module.scss'
import { syncCache } from 'store/@reducers/exams'
import { img } from 'assets/compat'

const Exercise = () => {
  const categories = useCategories()

  const dispatchToStore = useDispatch()

  const { model } = useModels()

  const { count, update, isReached } = useCounter(0, 0)

  const { exercise, limit } = useSelector(selectIndexWithSelector(count.value))

  const history = useHistory()

  const location = useLocation()

  const progress = useProgress()

  const [state, dispatch] = useReducer(exerciseReducer, initialState)

  const [height, width] = useWindowSize()

  const [report, setReport] = useToggler()

  const i18next = useTranslation()

  const sounds = useSounds()

  /**
   * @description
   * Selections will be initialized if exercises starts with multiple choice.
   */
  const updateWhenCountChanges = () => {
    if (exercise) {
      if ('questions' in exercise) {
        const questions = exercise.questions.length

        dispatch(setPreselection(questions))
      }

      if ('modules' in exercise) {
        const levels = exercise.modules.length - 1

        const fillWithModularization = (data, context) => {
          const translatePick = i18next.t('ALL.PICK')

          return Array(data.length).fill(
            context === dynamic.DROPDOWN ? i18next.t(translatePick) : ''
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

  /**
   * @description
   * This run one time.
   */
  const progressCallback = () => {
    const { context, id, preload } = location.state

    if (preload) {
      exercise &&
        /**
         * @description
         * Get the progress of the current user.
         */ dispatchToStore(
          fetchProgressThunk({
            examId: id
          })
        )
          .then(unwrapResult)
          .then(({ response }) => {
            if (response) {
              const { name } = categories.data.find(category =>
                like([category.name], context)
              )

              const { data } = response

              const progressRef = data[name]


              if (progressRef && progressRef.completed) {
                history.push({
                  pathname: path.FEEDBACK,
                  state: {
                    ignore: true,
                    download: true
                  },
                  search: `?id=${id}&context=${context}`
                })
              } else {
                update.set(progressRef.lastIndex)
              }
            }
          })
          .catch(err => {
            if (err.notFound) {
              dispatchToStore(
                createProgressThunk({
                  examId: id
                })
              )
            }
          })
    } else {
      history.push({
        pathname: path.DASHBOARD
      })
    }
  }

  useEffect(progressCallback, [])

  useEffect(updateWhenCountChanges, [count.value])

  useEffect(() => {
    if (exercise) {
      update.limit(limit)
    } else {
      const { id, context } = location.state

      history.push({
        pathname: path.FEEDBACK,
        state: {
          ignore: true,
          download: true
        },
        search: `?id=${id}&context=${context}`
      })
    }
  }, [exercise, history, isReached, limit, location.state, update])

  /**
   * @description
   * Set the new selection on the screen.
   */
  const handleSelection = React.useCallback(
    selection => {
      const action = handleContextSelection(exercise.label)

      action && dispatch(action(selection))
    },
    [exercise]
  )

  const handleLevelSelection = selection => {
    dispatch(setLevelSelection(selection))
  }

  /**
   * @description
   * Takes the arguments from handleClickNext.
   * This the callback function.
   */
  const handleCallbackValidation = useCallback(
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

  /**
   * @param {string} key
   * @returns {null}
   */
  const getPartialUpdateFromFeedback = key => {
    const withFuzzy = true

    switch (withFuzzy) {
      case like(key, SPEAKING):
        return []

      case like(key, WRITING):
        return state.selections

      default:
        return null
    }
  }

  /**
   * @description
   * On next, will be validated.
   */
  const handleClickNext = () => {
    /**
     * @description
     * If next is already checked we should increment the counter.
     */
    if (state.next) {
      const { label } = exercise

      const { name } = model

      try {
        /**
         * @description
         * Get marking or bandScore.
         */
        const score = getScore({
          model: name,
          modular: 'modules' in exercise,
          label,
          data: {
            modules: state.feedback.modular,
            selection: state.feedback.single,
            selections: state.feedback.multiple
          }
        })

        /**
         * @description
         * Last exercise pending.
         */
        const lastIndex = count.value + 1

        /**
         * @description
         * Required parameter from progress.
         */
        const {
          id,
          data: { uuid }
        } = progress.data

        /**
         * @description
         * Current exercise "category" being part.
         */
        const { name: key } = categories.data.find(category =>
          like([category.name], location.state.context)
        )

        const thunkRef = {
          id,
          key,
          lastIndex,
          score,
          uuid,
          feedback: getPartialUpdateFromFeedback([key]),
          recordings: state.recordings
        }

        /**
         * @description
         * Sending to server to update user progress in a shallow way.
         */
        dispatchToStore(updateProgressThunk(thunkRef))

        /**
         * @description
         * Caching in our redux store the request to use in feedback if something went wrong.
         */
        dispatchToStore(syncCache(thunkRef))
        /**
         * @description
         * Updating UI With BandScore.
         * ** UPDATING localState only. **
         */
        dispatch(setScore(score))
      } catch (err) {
        ToastsStore.error(err.message)
      } finally {
        dispatch(setUpdate())

        return update.increment()
      }
    }

    validationGeneral(
      {
        exercise,
        state
      },
      handleCallbackValidation
    )
  }

  /**
   * @description
   * Opens modal for reporting issues.
   */
  const handleReport = () => {
    setReport(true)
  }

  /**
   * @param {Blob} record
   * Takes the current audio file.
   */
  const handleRecording = record => {
    dispatch(setRecord(record))
  }

  /**
   * Switch the section to the current level.
   * Section means, module in other words.
   * @param {number} level
   */
  const handleLevelUpdate = (level = 1) => {
    dispatch(setIncreaseLevel(level))
  }

  /**
   * @description
   * Handles the report context.
   */
  const handleReportSuccess = () => {}

  const handleRedirectDashboard = () => {
    history.push(path.DASHBOARD)
  }

  /***
   * @description
   * Memoizing Provider Context for optimal rendering.
   */
  const provider = useMemo(
    () => ({
      exercise,
      handleRecording,
      handleSelection,
      handleLevelSelection
    }),
    [exercise, handleSelection]
  )

  const increaseLevel = () => {
    const level = state.data.level + 1

    handleLevelUpdate(level)
  }

  const decreaseLevel = () => {
    const level = state.data.level - 1

    handleLevelUpdate(level)
  }

  return (
    <ErrorHandler>
      <Template withLoader={progress.loading} withNavbar={false} view>
        <div className={styles.container}>
          <ExamLayout onLeave={handleRedirectDashboard} progress={count} />
          {state.allowMultipleFeed ? (
            <Feedback results={state.feedback.multiple} />
          ) : (
            <ExamContext.Provider value={state}>
              <ExerciseContext.Provider value={provider}>
                {exercise &&
                  (exercise.modules ? (
                    /**
                     * @description
                     * Feedback in section is apply to exception of a modular feedback.
                     */
                    <Section
                      feedback={state.feedback.modular}
                      levels={state.data.levels}
                      level={state.data.level}
                      levelChange={handleLevelUpdate}
                    >
                      <div className={styles.container}>
                        <Module />
                      </div>
                    </Section>
                  ) : (
                    <Picker render={location.state.context} />
                  ))}
              </ExerciseContext.Provider>
            </ExamContext.Provider>
          )}
        </div>
      </Template>
      <Footer
        renderValidation={state.allowFeed}
        selection={state.feedback.single}
      >
        {state.next || state.feedback.single ? (
          <div />
        ) : (
          <OverlayMessage message="Reportar">
            <img
              alt="flag"
              className="hovered"
              src={img.flag}
              height={40}
              width={30}
              onClick={handleReport}
            />
          </OverlayMessage>
        )}
        <div>
          {exercise && exercise.modules ? (
            state.data.level === state.data.levels ? (
              <>
                {state.next ? (
                  <React.Fragment />
                ) : (
                  <AptisButton className={styles.next} onClick={decreaseLevel}>
                    Back
                  </AptisButton>
                )}
                <AptisButton onClick={handleClickNext}>
                  {state.next ? 'NEXT' : 'CHECK'}
                </AptisButton>
              </>
            ) : (
              <FlexContainer>
                {state.data.level === 0 || (
                  <AptisButton className={styles.next} onClick={decreaseLevel}>
                    Back
                  </AptisButton>
                )}
                <AptisButton onClick={increaseLevel}>Next</AptisButton>
              </FlexContainer>
            )
          ) : (
            <AptisButton onClick={handleClickNext}>
              {state.next ? 'NEXT' : 'CHECK'}
            </AptisButton>
          )}
        </div>
      </Footer>
      {state.allowConfetti && (
        <Confetti height={height / 1} width={width / 1} />
      )}
      <Report
        enabled={report}
        onClose={setReport}
        onSuccess={handleReportSuccess}
      />
    </ErrorHandler>
  )
}

export default Exercise
