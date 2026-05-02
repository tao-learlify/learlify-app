import React, { useCallback, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import moment from 'moment'

import useAuthProvider from 'hooks/useAuthProvider'
import useEvalautions from 'hooks/useEvaluations'
import usePage from 'hooks/usePage'
import useSounds from 'hooks/useSounds'

import {
  fetchTeacherOverviewThunk,
  patchEvaluationProcess,
  updateEvaluationThunk
} from 'store/@thunks/evaluations'

import CountOverview from './components/CountOverview'
import Management from 'components/Management'
import Template from 'components/Template'
import Text from 'components/Text'
import TableRow from 'components/TableRow'
import TableHeader from 'components/TableHeader'
import FlexContainer from 'components/FlexContainer'
import PATH from 'utils/path'
import Pagination from 'components/Pagination'

import { img } from 'assets/img'
import { getFullName } from 'utils/functions'

import { APTIS } from 'constant/models'
import { STATUS } from 'modules/evaluations'
import Meeting from 'components/Meeting'

const TeacherView = () => {
  const dispatch = useDispatch()

  const own = usePage()

  const evaluations = usePage()

  const history = useHistory()

  const sounds = useSounds()

  const { profile } = useAuthProvider()

  const { fetchEvaluations, data, pagination } = useEvalautions({
    latest: false
  })

  const owns = useEvalautions({
    owns: true
  })

  const count = useEvalautions({
    count: true
  })

  useEffect(() => {
    fetchEvaluations({ own: false, page: evaluations.page })
  }, [fetchEvaluations, evaluations.page])

  useEffect(() => {
    fetchEvaluations({ own: true, page: own.page })
  }, [fetchEvaluations, own.page])

  useEffect(() => {
    dispatch(fetchTeacherOverviewThunk())
  }, [dispatch])

  /**
   * @param {Evaluation}
   */
  const getEvaluationContext = ({ status }) => {
    switch (status) {
      case STATUS.PENDING:
        return 'Disponible'

      case STATUS.TAKEN:
        return 'En revisión'

      case STATUS.EVALUATED:
        return 'Evaluado'

      default:
        return null
    }
  }

  /**
   * @param {Evaluation}
   */
  const getEvaluationImage = ({ status }) => {
    switch (status) {
      case STATUS.PENDING:
        return img.feedback

      case STATUS.TAKEN:
        return img.teacher

      default:
        return img.teacher
    }
  }

  /**
   * @description
   * Handle click on the evaluation.
   */
  const handleClickEvaluation = useCallback(
    /**
     *
     * @param {Evaluation}
     */
    ({ id, status, teacher, user }) => {
      /**
       * @description
       * Making evaluable by the teacher if is pending.
       */
      if (status === STATUS.PENDING) {
        dispatch(
          updateEvaluationThunk({
            id,
            status: STATUS.TAKEN
          })
        ).then(() =>
          ToastsStore.info(
            `Has tomado la evaluación pendiente de ${getFullName(
              user.firstName,
              user.lastName
            )}`
          )
        )
      }

      /**
       * @description
       * Already taken? let's see if the evaluations belongs to the current user.
       */
      if (status === STATUS.TAKEN) {
        /**
         * @description
         * This is only UI validation
         * Backend is done the samething for this context.
         */
        if (teacher.id === profile.id) {
          const pathname = PATH.EVALUATION.concat('/', id)

          return history.push({
            pathname
          })
        }

        sounds.play('ping')

        ToastsStore.warning(
          'Estimado profesor, el examen está siendo evaluado por otro profesor'
        )
      }
    },
    [dispatch, history, profile, sounds]
  )

  /**
   * @description
   * Leaves the evaluation, and grants to everyone teacher the possibility to take the current evaluation.
   */
  const handleLeaveEvalaution = useCallback(
    ({ id }) => {
      dispatch(
        updateEvaluationThunk({
          id,
          status: STATUS.PENDING,
          own: true
        })
      ).then(() => ToastsStore.info('La evaluación ha sido retirada'))
    },
    [dispatch]
  )

  /**
   * @description
   * Handles view evaluation
   */
  const handleViewEvaluation = useCallback(
    /**
     * @param {Evaluation} evaluation
     */
    evaluation => {
      const { id } = evaluation

      const pathname = PATH.EVALUATION.concat('/', id)

      history.push({
        pathname
      })
    },
    [history]
  )

  const handleClickReevaluationAgain = useCallback(
    /**
     * @param {Evaluation} evaluation
     */
    async evaluation => {
      if (evaluation.stash) {
        return dispatch(patchEvaluationProcess({ id: evaluation.id }))
          .then(() => { ToastsStore.info('Se ha entrado en proceso de reevaluación') })
      }

      const { id } = evaluation

      const pathname = PATH.EVALUATION.concat('/', id)

      history.push({
        pathname
      })
    },
    [dispatch, history]
  )

  return (
    <Template withLoader={count.loading} view>
      <CountOverview {...count.data} />
      <hr />
      <Meeting />
      <Row>
        <Col md={6}>
          <FlexContainer>
            <Text center tag="p" color="blue">
              Evaluaciones disponibles
            </Text>
          </FlexContainer>
          <FlexContainer>
            <Management
              color="dark"
              bold
              border={false}
              alternative
              rows={rows}
            >
              {data.map((evaluation, index) => (
                <TableRow key={evaluation.id}>
                  <TableHeader value={index + 1} />
                  <TableHeader
                    value={getFullName(
                      evaluation.user.firstName,
                      evaluation.user.lastName
                    )}
                  />
                  <TableHeader value={evaluation.category.name} />
                  <TableHeader value={getEvaluationContext(evaluation)} />
                  <TableHeader
                    value={evaluation.exam ? evaluation.exam.model.name : APTIS}
                  />
                  <TableHeader>
                    <img
                      className="img-responsive hovered"
                      alt={getEvaluationContext(evaluation)}
                      src={getEvaluationImage(evaluation)}
                      width={30}
                      onClick={() => handleClickEvaluation(evaluation)}
                    />
                  </TableHeader>
                </TableRow>
              ))}
            </Management>
          </FlexContainer>
          {pagination && (
            <FlexContainer>
              <Pagination {...pagination} onClick={evaluations.handleSet} />
            </FlexContainer>
          )}
        </Col>
        <Col md={6}>
          <FlexContainer>
            <Text center tag="p" color="blue">
              Mis evaluaciones
            </Text>
          </FlexContainer>
          <Management color="dark" border={false} rows={rows}>
            {owns.data.map((evaluation, index) => (
              <TableRow key={evaluation.id}>
                <TableHeader value={index + 1} />
                <TableHeader
                  value={getFullName(
                    evaluation.user.firstName,
                    evaluation.user.lastName
                  )}
                />
                <TableHeader value={evaluation.category.name} />
                <TableHeader value={moment(evaluation.updatedAt).fromNow()} />
                <TableHeader
                  value={evaluation.exam ? evaluation.exam.model.name : APTIS}
                />
                <TableHeader>
                  {evaluation.status === STATUS.EVALUATED ? (
                    <>
                      <img
                        className="hovered mr-1"
                        onClick={() => handleClickReevaluationAgain(evaluation)}
                        alt="usability"
                        width={27.6}
                        src={img.usability}
                      />
                      <img
                        className="hovered ml-1"
                        onClick={() =>
                          handleClickReevaluationAgain({
                            ...evaluation,
                            stash: true
                          })
                        }
                        alt="usability"
                        width={27.6}
                        src={img['completed-task']}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        className="hovered mr-1"
                        alt="rating"
                        src={img.rating}
                        onClick={() => handleViewEvaluation(evaluation)}
                      />
                      <img
                        className="hovered ml-1"
                        alt="file"
                        src={img.file}
                        onClick={() => handleLeaveEvalaution(evaluation)}
                      />
                    </>
                  )}
                </TableHeader>
              </TableRow>
            ))}
          </Management>
          {owns.pagination && (
            <FlexContainer>
              <Pagination {...owns.pagination} onClick={own.handleSet} />
            </FlexContainer>
          )}
        </Col>
      </Row>
    </Template>
  )
}

const rows = ['#', 'Nombre', 'Categoría', 'Estado', 'Modelo', 'Opción']

export default TeacherView
