import React, { memo, useCallback } from 'react'
import { Progress } from 'components/ui'
import classNames from 'clsx'

import useExamConsumer from 'hooks/useExamConsumer'
import useToggler from 'hooks/useToggler'

import Button from 'views/exams/components/Button'
import CompletedUnit from 'components/CompletedUnit'
import FallbackMode from 'components/FallbackMode'
import Feedback from 'components/Feedback'
import ErrorHandler from 'views/errors'
import Footer from 'components/Footer'
import Main from './Main'
import Module from 'components/Module'
import Picker from 'views/exams/components/Picker'
import Sidebar from './Sidebar'
import Section from 'components/Section'
import Theory from './Theory'

import styles from 'views/courses/styles.module.scss'

import { calcProgress } from 'utils/progress'
import { over } from 'utils/functions'

import { splitContextFromSection } from '../utils'
import { img } from 'assets/compat'

import { Button as CommonButton } from 'components/ui'
import { TURQUOISE } from 'assets/colors'
import Text from 'components/Text'

/**
 * @typedef {Object} ContentProps
 * @property {boolean} completed
 * @property {number} current
 * @property {number} total
 * @property {boolean} loading
 * @property {() => boolean} onUpdate
 * @property {() => void} onNextUnit
 * @property {() => void} onTryAgain
 */

/**
 * @type {React.FunctionComponent<ContentProps>}
 */
const Content = ({
  demo,
  completed,
  current,
  loading,
  onNextUnit,
  onTryAgain,
  onUpdate,
  total
}) => {
  const {
    allowFeed,
    allowMultipleFeed,
    data,
    error,
    exercise,
    feedback,
    handleLevelUpdate,
    handleSelectUnit,
    next,
    section,
    unit,
    units,
    increaseLevel,
    decreaseLevel
  } = useExamConsumer()

  const [collapsed, setCollapsed] = useToggler()

  const ref = section[current]

  const handleUpdate = useCallback(
    /**
     * @param {boolean} from
     */
    from => {
      if (ref.theory || ref.back || ref.next) {
        return onUpdate(from)
      }

      if (from) {
        return onUpdate(from)
      }
    },
    [ref, onUpdate]
  )

  if (error) {
    return (
      <div className={styles.app}>
        <Sidebar units={units} onClickUnit={handleSelectUnit}>
          <Main onToggleContext={setCollapsed}>
            <div className={styles.context}>
              <div className={classNames(flex, alignItemsCenter)}></div>
              <Text color="blue" center tag="h4">
                Error
              </Text>
            </div>
          </Main>
        </Sidebar>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar
        demo={demo}
        units={units}
        onClickUnit={handleSelectUnit}
        collapsed={collapsed}
        onLeaveContext={setCollapsed}
      />
      <Main onToggleContext={setCollapsed}>
        <Text lighter center color="blue" tag="h5">
          Unit {unit + 1}
        </Text>
        {completed ? (
          <>
            <br />
            <hr />
            <div className={styles.completed}>
              <CompletedUnit />
              <img
                className={styles.commonLeft}
                alt="rating"
                lazy="true"
                src={img.complete}
              />
              <CommonButton
                background={TURQUOISE}
                className={styles.commonLeft}
                onClick={onTryAgain}
              >
                Try Again
              </CommonButton>
              <CommonButton
                background={TURQUOISE}
                className={styles.commonRight}
                onClick={onNextUnit}
              >
                Next Unit
              </CommonButton>
            </div>
          </>
        ) : (
          <>
            {loading ? (
              <FallbackMode />
            ) : (
              <>
                <div className={styles.context}>
                  <div className={classNames(flex, alignItemsCenter)}>
                    <Progress
                      className="w-75"
                      value={calcProgress(current + 1, total)}
                      label={over(current, total, true)}
                    />
                  </div>
                </div>
                {ref &&
                  (unit === 0 || unit) &&
                  (ref.theory ? (
                    <>
                      <div className={classNames(styles.theory)}>
                        <hr />
                        <ErrorHandler>
                          <Theory
                            heading={ref.theory.heading}
                            title={ref.theory.title}
                            subheading={ref.theory.subheading}
                            imageUrl={ref.theory.imageUrl}
                          />
                        </ErrorHandler>
                        <br />
                      </div>
                      <Footer
                        renderValidation={null}
                        selection={null}
                        className={styles.flexInFooter}
                      >
                        {current === 0 ? (
                          <div />
                        ) : (
                          <Button onClick={() => handleUpdate({ back: true })}>
                            Back
                          </Button>
                        )}
                        <Button onClick={() => handleUpdate({ next: true })}>
                          Next
                        </Button>
                      </Footer>
                    </>
                  ) : (
                    exercise && (
                      <ErrorHandler>
                        <div className={styles.exercise}>
                          {allowMultipleFeed ? (
                            <Feedback results={feedback.multiple} />
                          ) : exercise.modules ? (
                            <Section
                              feedback={feedback.modular}
                              levels={data.levels}
                              level={data.level}
                              levelChange={handleLevelUpdate}
                            >
                              <Module />
                            </Section>
                          ) : (
                            <Picker
                              render={splitContextFromSection(exercise.label)}
                            />
                          )}
                          <br />
                        </div>
                        <Footer
                          className={styles.flexInFooter}
                          renderValidation={allowFeed}
                          selection={feedback.single}
                        >
                          {exercise && exercise.modules ? (
                            data.level === data.levels ? (
                              <>
                                {next ? (
                                  <div />
                                ) : (
                                  <Button className={styles.next} onClick={decreaseLevel}>Back</Button>
                                )}
                                <Button onClick={() => handleUpdate(true)}>{next ? 'NEXT' : 'CHECK'}</Button>
                              </>
                            ) : (
                              <>
                                {data.level === 0 ? (
                                  <div />
                                ) : (
                                  <Button
                                    className={styles.next}
                                    onClick={decreaseLevel}
                                  >
                                    Back
                                  </Button>
                                )}
                                <Button onClick={increaseLevel}>
                                  Next
                                </Button>
                              </>
                            )
                          ) : (
                            <>
                              {next ? (
                                <div />
                              ) : (
                                <Button onClick={() => handleUpdate({ back: true })}>
                                  Back
                                </Button>
                              )}
                              <Button onClick={() => handleUpdate(true)}>
                                {next ? 'NEXT' : 'CHECK'}
                              </Button>
                            </>
                          )}
                        </Footer>
                      </ErrorHandler>
                    )
                  ))}
              </>
            )}
          </>
        )}
      </Main>
    </div>
  )
}

const flex = 'd-flex justify-content-around'

const alignItemsCenter = 'align-items-center'

export default memo(Content)
