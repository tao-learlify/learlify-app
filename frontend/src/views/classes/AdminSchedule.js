import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { ToastsStore } from 'react-toasts'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import { SphereSpinner as Spinner } from 'react-spinners-kit'
import { v4 as UUID } from 'uuid'

import { plus } from 'react-icons-kit/fa/plus'
import { minus } from 'react-icons-kit/fa/minus'
import { language } from 'react-icons-kit/fa/language'
import { thList } from 'react-icons-kit/fa/thList'

import moment from 'moment'

import classNames from 'clsx'
import Icon from 'react-icons-kit'

import useLanguages from 'hooks/useLanguages'
import useModels from 'hooks/useModels'
import useTeachers from 'hooks/useTeachers'
import useToggler from 'hooks/useToggler'
import useSchedule from 'hooks/useSchedule'

import ModalDialog from 'components/ModalDialog'
import Schedule from 'components/Schedule'
import Template from 'components/Template'
import Text from 'components/Text'

import { fetchTeachersThunk } from 'store/@thunks/users'
import { fetchModelsThunk } from 'store/@thunks/models'
import {
  createScheduleThunk,
  deleteScheduleThunk,
  fetchSchedulesThunk
} from 'store/@thunks/schedules'

import { createStagedSchedule } from 'store/@reducers/schedules'

import { ScheduleContainer } from 'views/agreement/styles'
import { getFullName } from 'utils/functions'

import styles from './classes.module.scss'
import { BLUE } from 'assets/colors'
import { withAdmin } from 'hocs'

const AdminSchedule = () => {
  const context = useRef(null)

  const dispatch = useDispatch()

  const languages = useLanguages()

  const schedules = useSchedule()

  const teachers = useTeachers()

  const models = useModels()

  const [modal, setModal] = useToggler()

  const [commits, setCommits] = useState([])

  useEffect(() => {
    /**
     * @description
     * If the page loads directly with url.
     */
    if (schedules.staged === null && teachers.data.length === 0) {
      /**
       * @description
       * Fetching users.
       */
      dispatch(fetchTeachersThunk(defaultFetchThunk))
    } else if (schedules.staged === null) {
      context.current = {
        user: true
      }
      /**
       * @description
       * If users are already in the redux store.
       */
      setModal(true)
    } else {
      const { id } = schedules.staged.user

      dispatch(
        fetchSchedulesThunk({
          userId: id
        })
      )
    }
  }, [dispatch, schedules.staged, teachers.data, setModal])

  useEffect(() => {
    if (models.data.length === 0) {
      dispatch(fetchModelsThunk())
    }
  }, [dispatch, models.data.length])

  /**
   * @description
   * Fetching schedule
   */
  const handleClickContinue = () => {
    if (schedules.staged === null) {
      const [user] = teachers.data

      dispatch(
        createStagedSchedule({
          user
        })
      )
    }

    setModal(false)
  }

  /**
   * @description
   * Selects the current teacher
   * @param {React.FormEvent<HTMLInputElement>}
   * @returns {void}.
   */
  const handleSelectTeacher = ({ target: { value } }) => {
    const user = teachers.data.find(user => user.firstName === value)

    dispatch(
      createStagedSchedule({
        user
      })
    )
  }

  /**
   * @description
   * Commit can be on one stage.
   * Deleted, or added.
   * If the commit is about to being deleted. we check first, on "commit.deleted"
   * If not, simply we need to add.
   * @param {Commit} commit
   */
  const handleCommitSchedule = async commit => {
    if (commit.deleted) {
      return dispatch(deleteScheduleThunk({ id: commit.deleted }))
        .then(unwrapResult)
        .then(() => {
          setCommits(commits =>
            commits.filter(localCommit => localCommit.id !== commit.deleted)
          )

          ToastsStore.success('El horario ha sido eliminado exitosamente')
        })
        .catch(() => {
          ToastsStore.error(
            'El horario no puede ser eliminado, verifica que esté reservado'
          )
        })
    }

    const alreadyTakenSchedule = commits.find(localCommit =>
      moment(localCommit.startDate).isSame(commit.added.startDate)
    )

    if (alreadyTakenSchedule) {
      return ToastsStore.warning('Se ha intentado asignar la misma fecha')
    }

    const [lang] = languages.data

    const [model] = models.data

    const user = schedules.staged.user

    const schedule = {
      startDate: moment
        .utc(commit.added.startDate)
        .format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment
        .utc(commit.added.endDate)
        .subtract('15', 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      userId: user.id,
      langId: lang.id,
      modelId: model.id,
      key: UUID()
    }

    setCommits(commits => [...commits, schedule])

    ToastsStore.info(`Se ha agregado un horario para ${user.firstName}`)
  }

  /**
   * @param {Commit} commit
   * @param {Commit} staged
   * @param {boolean} value
   * @returns {Commit}
   */
  const assignLoaderOnCommit = (commit, staged, value) => {
    return commit.key === staged.key
      ? Object.assign(commit, {
          loading: value
        })
      : commit
  }

  /**
   * Sends to the server and creates a schedule.
   * @param {number} index
   */
  const handleConfirmSchedule = index => {
    const staged = commits[index]

    setCommits(commits =>
      commits.map(commit => assignLoaderOnCommit(commit, staged, true))
    )

    dispatch(
      createScheduleThunk({
        ...staged,
        key: undefined,
        loading: undefined
      })
    )
      .then(unwrapResult)
      .then(() => {
        setCommits(commits =>
          commits.filter(commit => commit.key !== staged.key)
        )

        ToastsStore.success('El horario se agregó exitosamente')
      })
      .catch(() => {
        setCommits(commits =>
          commits.map(commit => assignLoaderOnCommit(commit, staged, false))
        )

        ToastsStore.warning('Ha ocurrido un error agregando el horario')
      })
  }

  const handleSoftDeleteSchedule = useCallback(
    /**
     * @param {string} key
     */
    key => {
      setCommits(localCommit =>
        localCommit.filter(commit => commit.key !== key)
      )
    },
    []
  )

  /**
   * @param {number} index
   */
  const handleSelectLanguageSchedule = useCallback(
    index => {
      context.current = {
        language: true,
        commit: commits[index]
      }

      setModal(true)
    },
    [setModal, commits]
  )

  const handleSelectModelSchedule = useCallback(
    /**
     * @param {number} index
     */
    index => {
      context.current = {
        model: true,
        commit: commits[index]
      }

      setModal(true)
    },
    [commits, setModal]
  )

  /**
   * @param {Commit}
   * @returns {Language}
   */
  const handleGetLang = ({ langId }) => {
    const language = languages.data.find(lang => lang.id === langId)

    return language.lang
  }

  /**
   * @description
   * Changes the current language for the selected commit.
   * @param {React.FormEvent<HTMLSelectElement>} e
   */
  const handleChangeLanguage = e => {
    const lang = languages.data.find(({ lang }) => lang === e.target.value)

    if (context.current.commit) {
      setCommits(locales =>
        locales.map(commit => {
          return commit.key === context.current.commit.key
            ? Object.assign(commit, { langId: lang.id })
            : commit
        })
      )
    }
  }

  return (
    <Template withLoader={languages.loading || models.loading} view>
      <ScheduleContainer>
        <Schedule data={schedules.data} onCommit={handleCommitSchedule} />
      </ScheduleContainer>
      <div className={styles.commits}>
        {commits.map((commit, index) => (
          <React.Fragment key={commit.key}>
            <div className={styles.container}>
              <Text
                color={commit.loading ? 'muted' : 'blue'}
                center
                bold
                tag="small"
              >
                Inicia: {moment(commit.startDate).format('YYYY-MM-DD HH:mm a')}
              </Text>
              <Text
                color={commit.loading ? 'muted' : 'blue'}
                center
                bold
                tag="small"
              >
                Finaliza: {moment(commit.endDate).format('YYYY-MM-DD HH:mm a')}
              </Text>
              <Text
                color={commit.loading ? 'muted' : 'blue'}
                center
                bold
                tag="small"
              >
                Idioma: {handleGetLang(commit)}
              </Text>
              <div className={styles.container}>
                {commit.loading ? (
                  <Spinner size={24} color={BLUE} />
                ) : (
                  <>
                    <Icon
                      className={classNames(
                        'text-info icon hovered',
                        styles.icon
                      )}
                      icon={plus}
                      onClick={() => handleConfirmSchedule(index)}
                    />
                    <Icon
                      className={classNames(
                        'text-danger icon hovered',
                        styles.icon
                      )}
                      icon={minus}
                      onClick={() => handleSoftDeleteSchedule(commit.key)}
                    />
                    <Icon
                      className={classNames(
                        'text-success icon hovered',
                        styles.icon
                      )}
                      icon={language}
                      onClick={() => handleSelectLanguageSchedule(index)}
                    />
                    <Icon
                      className={classNames(
                        'text-warning icon hovered',
                        styles.icon
                      )}
                      icon={thList}
                      onClick={() => handleSelectModelSchedule(index)}
                    />
                  </>
                )}
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
      <ModalDialog
        textHeader="Seleccionar"
        enabled={modal}
        onCloseRequest={setModal}
      >
        {context.current &&
          (context.current.user ? (
            <>
              <Text bold center color="blue" tag="p">
                Lista de profesores
              </Text>
              <FormGroup>
                <FormControl as="select" onChange={handleSelectTeacher}>
                  {teachers.data.map(user => (
                    <option key={user.id} value={user.firstName}>
                      {getFullName(user.firstName, user.lastName)}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <br />
              <FormGroup>
                <Button
                  block
                  size="sm"
                  variant="success"
                  onClick={handleClickContinue}
                >
                  Seleccionar
                </Button>
              </FormGroup>
            </>
          ) : (
            <>
              <Text bold center color="blue" tag="p">
                Lista de Lenguajes
              </Text>
              <FormGroup>
                <FormControl as="select" onChange={handleChangeLanguage}>
                  {languages.data.map(language => (
                    <option key={language.id} value={language.lang}>
                      {language.lang}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup>
                <Button onClick={setModal}>Aplicar</Button>
              </FormGroup>
            </>
          ))}
      </ModalDialog>
    </Template>
  )
}

const defaultFetchThunk = {
  page: 1,
  role: 'Teacher',
  search: '',
  limit: 100
}

export default withAdmin(AdminSchedule)