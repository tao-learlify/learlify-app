import React, { useEffect } from 'react'
import { Badge, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Markdown from 'react-markdown'
import classNames from 'clsx'
import Icon from 'react-icons-kit'
import moment from 'moment'

import { calendarO } from 'react-icons-kit/fa/calendarO'
import { microphone } from 'react-icons-kit/fa/microphone'
import { pencil } from 'react-icons-kit/fa/pencil'
import { ic_done_all } from 'react-icons-kit/md/ic_done_all'
import { ic_star } from 'react-icons-kit/md/ic_star'
import { ic_watch_later } from 'react-icons-kit/md/ic_watch_later'

import { htmlParser } from 'constant'

import styles from './viewer.module.scss'

import useAuthProvider from 'hooks/useAuthProvider'
import useCounter from 'hooks/useCounter'
import useEvaluations from 'hooks/useEvaluations'
import useScroll from 'hooks/useScroll'
import useToggler from 'hooks/useToggler'
import useModels from 'hooks/useModels'

import { setComments } from 'store/@reducers/evaluations'
import { updateEvaluationThunk } from 'store/@thunks/evaluations'

import Emoji from 'components/Emoji'
import Pannel from './Pannel'
import FlexContainer from 'components/FlexContainer'
import Text from 'components/Text'
import MarkdownEditor from 'components/MarkdownEditor'
import ModalDialog from 'components/ModalDialog'
import Speaking from 'components/Prototype/Speaking'
import Writing from 'components/Prototype/Writing'

import { Button } from 'styled'
import { getFullName } from 'utils/functions'
import { SPEAKING, WRITING } from 'constant/labels'
import { TURQUOISE, WHITE, RED } from 'assets/colors'
import { img } from 'assets/compat'

import roles from 'utils/roles'
import { STATUS } from 'modules/evaluations'
import { ToastsStore } from 'react-toasts'
import { APTIS, IELTS } from 'constant/models'

/**
 * @typedef {Object} ViewerProps
 * @property {boolean} edit
 * @property {boolean} latest
 *
 * @type {React.FunctionComponent<ViewerProps>}
 */
const astPlugin = [htmlParser]

const Viewer = ({ edit, latest, onEditMode }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { selected } = useEvaluations({ latest })

  const { profile } = useAuthProvider()

  const { count, update, isReached } = useCounter(0, 0)

  const { model } = useModels()

  const scrollFunction = useScroll('animateScroll', {
    duration: 1500,
    smooth: true
  })

  const [checkpoint, setCheckpoint] = useToggler()

  /**
   * @description
   * This only will run if the evaluations are in old format.
   */
  useEffect(() => {
    if (selected && latest) {
      const category = selected.category.name.toLowerCase() + 's'

      /**
       * @description
       * Extending limit of counting data.
       * This will allow to continue over and over again.
       */
      update.limit(selected.data[category].length)
    }

    if (selected && !latest) {
      switch (selected.category.name) {
        case SPEAKING:
          update.limit(selected.data.cloudStorageRef.length)
          break

        case WRITING:
          update.limit(selected.data.feedback.length)
          break

        default:
          break
      }
    }
  }, [selected, latest, update])

  useEffect(() => {
    if (isReached) {
      if (profile.role.name === roles.USER) {
        update.reset()
      }

      if (profile.role.name === roles.TEACHER) {
        setCheckpoint(true)
      }
    }
  }, [isReached, update, profile, setCheckpoint])

  /**
   * @param {Role}
   */
  const isUser = ({ role }) => {
    return role.name === roles.USER
  }

  const getContext = () => {
    switch (selected.category.name) {
      case SPEAKING:
        return (
          <div>
            <Icon className="text-blue" icon={microphone} />
            <Text bold color="blue" className={styles.date} tag="small">
              {selected.category.name}
            </Text>
          </div>
        )

      case WRITING:
        return (
          <div>
            <Icon className="text-blue" icon={pencil} />
            <Text bold color="blue" className={styles.date} tag="small">
              {selected.category.name}
            </Text>
          </div>
        )

      default:
        return <React.Fragment />
    }
  }

  const getPrototypeComponent = () => {
    if (isReached === false) {
      switch (selected.category.name) {
        case SPEAKING:
          return latest ? (
            <Speaking
              description={selected.data.speakings[count.value].description}
              feedback={selected.data.speakings[count.value].feedback}
              questions={selected.data.speakings[count.value].questions}
              latest
            />
          ) : (
            selected.data.cloudStorageRef[count.value] && (
              <Speaking
                normalize
                description={selected.exercises[count.value].description}
                questions={selected.exercises[count.value].questions}
                feedback={selected.data.cloudStorageRef[count.value]}
              />
            )
          )

        case WRITING:
          return latest ? (
            <Writing
              description={selected.data.writings[count.value].description}
              feedback={selected.data.writings[count.value].feedback}
              questions={selected.data.writings[count.value].questions}
            />
          ) : (
            selected.data.feedback[count.value] && (
              <Writing
                normalize
                feedback={selected.data.feedback[count.value]}
                description={selected.exercises[count.value].description}
                questions={selected.exercises[count.value].questions}
              />
            )
          )

        default:
          return null
      }
    }
  }

  /**
   * This function works fine for mobile devices to prevent scrolling.
   */
  const handleClickContinue = () => {
    if (isUser(profile)) {
      scrollFunction(null)

      update.increment()

      return
    }

    if (count.value === count.limit + 1) {
      return setCheckpoint(true)
    }

    update.increment()
  }

  /**
   * @description
   * Get the current status of evaluation.
   */
  const getCurrentStatus = () => {
    switch (selected.status) {
      case STATUS.EVALUATED:
        return (
          <div>
            <Icon className="text-success" icon={ic_done_all} />
            <Text lighter className={styles.date} color="blue" tag="small">
              {t('EVALUATIONS.STATUS.EVALUATED')}
            </Text>
          </div>
        )

      case STATUS.PENDING:
        return (
          <div>
            <Icon className="text-warning" icon={ic_watch_later} />
            <Text lighter className={styles.date} color="blue" tag="small">
              {t('EVALUATIONS.STATUS.TAKEN')}
            </Text>
          </div>
        )

      case STATUS.TAKEN:
        return (
          <div>
            <Icon className="text-warning" icon={ic_watch_later} />
            <Text className={styles.date} color="blue" tag="small">
              {t('EVALUATIONS.STATUS.TAKEN')}
            </Text>
          </div>
        )

      default:
        return <React.Fragment />
    }
  }

  /**
   * Gets the current comments in markdown mode.
   * @param {string} comments
   */
  const handleChangeComment = comments => {
    dispatch(
      setComments({
        selector: count.value,
        comments
      })
    )
  }

  const handlePickColor = () => {}

  /**
   * @description
   * Accepts the update and sets it to server.
   */
  const handleAcceptUpdate = () => {
    setCheckpoint(false)

    dispatch(
      updateEvaluationThunk({
        comments: selected.comments,
        id: selected.id,
        score: selected.score,
        status: STATUS.EVALUATED
      })
    )
      .then(() => ToastsStore.success('¡Has completado una evaluación!'))
      .catch(() => ToastsStore.error('¡Ups! un error ha ocurrido'))
  }

  /**
   * @description
   * Cancels and back.
   */
  const handleCancelUpdate = () => {
    update.decrement()

    setCheckpoint(false)
  }

  const handleGetScore = () => {
    if (selected.status === STATUS.EVALUATED) {
      switch (selected.exam.model.name) {
        case APTIS:
          return selected.stats ? selected.stats.marking : 'N/D'

        case IELTS:
          return selected.stats ? selected.stats.bandScore : 'N/D'

        default:
          return null
      }
    }
  }

  const handleGetSuffix = () => {
    switch (selected.exam.model.name) {
      case IELTS:
        return 'band score'

      default:
        return ''
    }
  }

  const renderComments = () => {
    if (latest && selected.data.comemnts) {
      return (
        <Text color="white" bold tag="small">
          {selected.data.comments}
        </Text>
      )
    }

    if (isUser(profile)) {
      return selected.status === STATUS.EVALUATED ? (
        <Markdown
          className="text-white"
          source={
            selected.data.comments[count.value]
              ? selected.data.comments[count.value].html
              : defaultHtmlTemplate
          }
          escapeHtml={false}
          astPlugins={astPlugin}
        />
      ) : (
        <Markdown
          className="text-white"
          source={
            selected.comments[count.value]
              ? selected.comments[count.value].html
              : defaultHtmlTemplate
          }
          escapeHtml={false}
          astPlugins={astPlugin}
        />
      )
    }

    return selected.status === STATUS.EVALUATED ? (
      <Markdown
        className="text-white"
        source={
          selected.data.comments[count.value]
            ? selected.data.comments[count.value].html
            : defaultHtmlTemplate
        }
        escapeHtml={false}
        astPlugins={astPlugin}
      />
    ) : (
      <Markdown
        className="text-white"
        source={
          selected.comments[count.value]
            ? selected.comments[count.value].html
            : defaultHtmlTemplate
        }
        escapeHtml={false}
        astPlugins={astPlugin}
      />
    )
  }

  if (isReached) {
    return checkpoint ? (
      <ModalDialog
        size="md"
        enabled={checkpoint}
        textHeader="¿Estás seguro/a que deseas completar esta evaluación?"
        onCloseRequest={handleCancelUpdate}
      >
        <FlexContainer justifyContent="space-evenly">
          <Button background={TURQUOISE} onClick={handleAcceptUpdate}>
            Aceptar
          </Button>
          <Button background={RED} onClick={handleCancelUpdate}>
            Cancelar
          </Button>
        </FlexContainer>
      </ModalDialog>
    ) : (
      <React.Fragment />
    )
  }

  return (
    selected && (
      <div>
        <div className={styles.container}>
          <React.Fragment>
            {isUser(profile) ? (
              <Emoji name="Teacher" />
            ) : (
              <img
                alt="runner"
                className={styles.emoji}
                src={img.fisherman}
                width={100}
              />
            )}
          </React.Fragment>
          <div className={styles.data}>
            {selected.teacher ? (
              <Text color="blue" bold>
                {isUser(profile)
                  ? getFullName(
                      selected.teacher.firstName,
                      selected.teacher.lastName
                    )
                  : getFullName(profile.firstName, profile.lastName)}
              </Text>
            ) : (
              <br />
            )}
            <div>
              <Icon className="text-blue" icon={calendarO} />
              <Text bold className={styles.date} color="blue" tag="small">
                {latest
                  ? moment(selected.createdAt).format('YYYY-MM-DD')
                  : isUser(profile)
                  ? moment(selected.updatedAt).format('YYYY-MM-DD')
                  : moment(selected.createdAt).format('YYYY-MM-DD')}
              </Text>
            </div>
            <div>
              {selected.exam && (
                <>
                  <Icon className="text-blue" icon={ic_star} />
                  <Badge
                    pill
                    style={{
                      backgroundColor: selected.exam.model.color,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    <Text bold center color="blue" tag="small">
                      {selected.exam.model.name}
                    </Text>
                  </Badge>
                </>
              )}
            </div>
            <React.Fragment>{getContext()}</React.Fragment>
            <React.Fragment>
              {latest && selected.status && getCurrentStatus()}
            </React.Fragment>
          </div>
        </div>
        <Row className={styles.row}>
          <Col md={edit ? 6 : 8}>{getPrototypeComponent()}</Col>
          <Col md={edit ? 6 : 4}>
            {edit ? (
              <>
                <MarkdownEditor
                  onPickColor={handlePickColor}
                  onChange={handleChangeComment}
                  value={
                    selected.comments[count.value]
                      ? selected.comments[count.value].text
                      : defaultHtmlTemplate
                  }
                />
                <br />
                <Button
                  background={TURQUOISE}
                  color={WHITE}
                  onClick={onEditMode}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <div>
                {selected.status === STATUS.EVALUATED ||
                  (profile.role.name === 'Teacher' && (
                    <Button
                      background={TURQUOISE}
                      color={WHITE}
                      onClick={onEditMode}
                    >
                      Comentar
                    </Button>
                  ))}
                <hr />
                {latest ? (
                  selected.data && (
                    <Text bold lighter color="muted" tag="small">
                      {t('EVALUATIONS.score', {
                        suffix: 'Marking',
                        score: selected.data.score,
                        model: 'Aptis'
                      })}{' '}
                      <img alt="stat" src={img.mark} />
                    </Text>
                  )
                ) : (
                  <>{selected.status && getCurrentStatus()}</>
                )}
                <br />
                {selected.status === STATUS.EVALUATED &&
                  (latest ? (
                    <React.Fragment />
                  ) : (
                    model && (
                      <Text lighter bold color="blue" tag="small">
                        {t('EVALUATIONS.score', {
                          suffix: handleGetSuffix(),
                          score: handleGetScore(),
                          model: model.name.toUpperCase()
                        })}
                      </Text>
                    )
                  ))}
                <div
                  className={classNames(
                    'border',
                    'rounded',
                    styles.comments,
                    styles.editor
                  )}
                >
                  {renderComments()}
                </div>
                {selected.status === STATUS.EVALUATED &&
                  (count.value === count.limit || (
                    <Button
                      onClick={handleClickContinue}
                      color={WHITE}
                      background={TURQUOISE}
                    >
                      {t('EVALUATIONS.continue')}
                    </Button>
                  ))}
                {selected.status === STATUS.EVALUATED || (
                  <>
                    {profile.role.name === 'Teacher' && (
                      <>
                        <br />
                        <Pannel current={count.value} />
                        <br />
                        <hr />
                      </>
                    )}
                    <Button
                      onClick={handleClickContinue}
                      color={WHITE}
                      background={TURQUOISE}
                    >
                      {t('EVALUATIONS.continue')}
                    </Button>
                    {count.value > 0 && (
                      <Button
                        onClick={() => update.decrement(1)}
                        className={styles.pannel}
                        color={WHITE}
                        background={TURQUOISE}
                      >
                        {t('EVALUATIONS.back')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </Col>
        </Row>
      </div>
    )
  )
}

Viewer.defaultProps = {
  latest: false,
  edit: false
}

const defaultHtmlTemplate = 'Insertar comentario'

export default Viewer
