import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, Col, Row, Button, FormGroup } from 'react-bootstrap'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { ic_mail } from 'react-icons-kit/md/ic_mail'
import { creditCardAlt } from 'react-icons-kit/fa/creditCardAlt'
import { videoCamera } from 'react-icons-kit/fa/videoCamera'
import {ic_assignment_ind} from 'react-icons-kit/md/ic_assignment_ind'

import { ToastsStore } from 'react-toasts'
import api from 'api'
import Icon from 'react-icons-kit'
import classNames from 'clsx'

import useForm from 'hooks/useForm'
import useRoles from 'hooks/useRoles'
import usePage from 'hooks/usePage'
import usePlans from 'hooks/usePlans'
import useTeachers from 'hooks/useTeachers'
import useUsers from 'hooks/useUsers'
import useToggler from 'hooks/useToggler'
import useModels from 'hooks/useModels'

import Text from 'components/Text'
import Template from 'components/Template'
import ErrorHandler from 'views/errors'
import Management from 'components/Management'
import TableRow from 'components/TableRow'
import TableHeader from 'components/TableHeader'
import Options from './components/Options'
import ModalDialog from 'components/ModalDialog'

import { getFullName } from 'utils/functions'
import { fetchUsersThunk, fetchTeachersThunk } from 'store/@thunks/users'
import { createStagedSchedule } from 'store/@reducers/schedules'
import { select } from 'store/@reducers/plans'

import styles from './index.module.scss'
import PATH from 'utils/path'
import { img } from 'assets/compat'

import { fetchModelsThunk } from 'store/@thunks/models'
import Meeting from 'components/Meeting'
import { selectModel } from 'store/@reducers/models'
import { fetchPlansThunk } from 'store/@thunks/plans'
import UserInfo from 'components/UserInfo'
import FlexContainer from 'components/FlexContainer'
import Pagination from 'components/Pagination'

const AdminView = () => {
  const refUser = useRef(3)

  const UP = usePage()

  const TP = usePage()

  const dispatch = useDispatch()

  const roles = useRoles({ preload: true })

  const plans = usePlans({ preload: true })

  const users = useUsers()

  const models = useModels()

  const teachers = useTeachers()

  const history = useHistory()

  const [form, onChange] = useForm({
    user: '',
    teacher: ''
  })

  const [options, setOptions] = useToggler(false)

  const [apiState, setApiState] = useToggler(false)

  const [control, setControl] = useState(null)


  /**
   * @description
   * Fetching users
   */
  useEffect(() => {
    const stream = dispatch(
      fetchUsersThunk({
        page: UP.page,
        role: 'User',
        search: form.user
      })
    )

    return () => {
      stream.abort()
    }
  }, [dispatch, UP.page, form.user])


  /**
   * @description
   * Fetching teachers
   */
  useEffect(() => {
    const stream = dispatch(
      fetchTeachersThunk({
        page: TP.page,
        role: 'Teacher',
        search: form.teacher
      })
    )

    return () => {
      stream.abort()
    }
  }, [dispatch, TP.page, form.teacher])


  /**
   * @description
   * Fetching models
   */
  useEffect(() => {
    const stream = dispatch(fetchModelsThunk())

    return () => {
      stream.abort()
    }
  }, [dispatch])

  
  /**
   * @description
   * Sending email recovering password to the user selected
   */
  const handleSendMail = useCallback(async () => {
    try {
      setApiState()

      await api.auth.forgotPassword(refUser.current.email)

      ToastsStore.info('Se ha enviado un correo electrónico de recuperación')
    } catch (err) {
      ToastsStore.error(err.name)
    } finally {
      setApiState()
    }
  }, [setApiState])


  /**
   * @description
   * Creating schedule for the current user.
   */
  const handleAssignSchedule = useCallback(() => {
    dispatch(
      createStagedSchedule({
        user: refUser.current
      })
    )

    history.push(PATH.CREATE_MEETING)
  }, [dispatch, history])



  /**
   * @description
   * Set rendering context for display UI content.
   */
  const handleSelectOption = useCallback(
    ({ option, user }) => {
      refUser.current = user

      const isModalRenderer = [controls.ASSIGN, controls.INFO]

      if (isModalRenderer.includes(option)) {
        setOptions(true)

        return setControl(option)
      }

      switch (option) {
        case controls.MAIL:
          return handleSendMail()

        case controls.MEET:
          return handleAssignSchedule()

        default:
          return null
      }
    },
    [setOptions, handleSendMail, handleAssignSchedule]
  )

  const handleChangePlan = useCallback(
    plan => {
      dispatch(select(plan))
    },
    [dispatch]
  )

  /**
   * @description
   * Handles assign the current package.
   */
  const handleAssignPackage = async () => {
    const { id, name } = plans.selected

    try {
      setApiState()

      await api.packages.assignPackage({
        planId: id,
        userId: refUser.current.id
      })

      ToastsStore.success(`Se ha asignado el paquete ${name} correctamente`)
    } catch (err) {
      ToastsStore.error(err.name)
    } finally {
      setApiState()

      setOptions(false)
    }
  }

  const handleChangeModel = useCallback(
    /**
     * @param {string} value
     */
    async value => {
      try {
        const data = models.data.find(model => model.name === value)

        dispatch(selectModel(data))

        dispatch(
          fetchPlansThunk({
            model: data.name
          })
        )
      } catch (err) {
        ToastsStore.warning('Hubo un error al intentar seleccionar el modelo')
      }
    },
    [dispatch, models.data]
  )

  const renderModalContent = () => {
    switch (control) {
      case controls.ASSIGN:
        return (
          <React.Fragment>
            <Text color="blue" tag="small">
              Seleccionar un plan
            </Text>
            <FormGroup>
              <Form.Control
                as="select"
                className={styles.container}
                onChange={e => handleChangePlan(e.target.value)}
                value={plans.selected.name}
              >
                {plans.data.map(plan => (
                  <option key={plan.id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </Form.Control>
            </FormGroup>
            <FormGroup>
              <Form.Control
                as="select"
                className={styles.container}
                onChange={e => handleChangeModel(e.target.value)}
                value={models.model.name}
              >
                {models.data.map(model => (
                  <option key={model.id} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </Form.Control>
            </FormGroup>
            <div className={styles.container}>
              <Button onClick={handleAssignPackage}>Asignar</Button>
            </div>
          </React.Fragment>
        )

      case controls.INFO:
        return (
          <React.Fragment>
           <FlexContainer>
              <UserInfo email={refUser.current.email} />
           </FlexContainer>
          </React.Fragment>
        )

      default:
        return <React.Fragment />
    }
  }

  const getTextHeaders = () => {
    switch (control) {
      case controls.ASSIGN:
        return 'Asignar Paquete'

      case controls.MEET:
        return 'Asignar Horario'

      case controls.INFO:
        return 'Detalles de usuario'

      default:
        return 'Seleccionar'
    }
  }

  return (
    <Template
      withLoader={
        roles.loading ||
        plans.loading ||
        users.loading ||
        teachers.loading ||
        models.loading ||
        apiState
      }
      view
    >
      <ErrorHandler>
        <hr />
        <Meeting />
        <Row>
          <Col>
            <div className={styles.form}>
              <Text color="blue" tag="small" className="link" hovered>
                <Icon
                  icon={ic_add}
                  className={classNames('text-blue', styles.plus)}
                  size={20}
                />{' '}
                Usuario
              </Text>
              <div>
                <Form.Control
                  type="text"
                  name="user"
                  size="sm"
                  onChange={onChange}
                  value={form.user}
                  placeholder="Buscar por correo electrónico"
                />
              </div>
            </div>
            <Management
              color="dark"
              bold
              border={false}
              alternative
              rows={rows}
              className={styles.table}
            >
              {users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableHeader>
                    <img
                      className="rounded"
                      alt="avatar"
                      width={20}
                      src={user.imageUrl ? user.imageUrl : img['user-male']}
                    />
                  </TableHeader>
                  <TableHeader
                    value={getFullName(user.firstName, user.lastName, true)}
                  />
                  <TableHeader value={user.email} />
                  <TableHeader>
                    <Options
                      data={optionsAsUser}
                      onClick={({ option }) =>
                        handleSelectOption({ option, user })
                      }
                    />
                  </TableHeader>
                </TableRow>
              ))}
            </Management>
            <FlexContainer>
              {users.pagination && (
                <Pagination {...users.pagination} onClick={UP.handleSet} />
              )}
            </FlexContainer>
          </Col>
          <Col>
            <div className={styles.form}>
              <Text color="blue" tag="small" className="link" hovered>
                <Icon
                  icon={ic_add}
                  className={classNames('text-blue', styles.plus)}
                  size={20}
                />{' '}
                Profesor
              </Text>
              <div>
                <Form.Control
                  type="text"
                  name="teacher"
                  size="sm"
                  onChange={onChange}
                  value={form.teacher}
                  placeholder="Buscar por correo electrónico"
                />
              </div>
            </div>
            <Management
              color="dark"
              className={styles.table}
              border={false}
              alternative
              rows={rows}
            >
              {teachers.data.map((user, index) => (
                <TableRow key={user.id}>
                  <TableHeader>
                    <img
                      className="rounded"
                      alt="avatar"
                      width={20}
                      src={user.imageUrl ? user.imageUrl : img['user-male']}
                    />
                  </TableHeader>
                  <TableHeader
                    value={getFullName(user.firstName, user.lastName)}
                  />
                  <TableHeader value={user.email} />
                  <TableHeader>
                    <Options
                      data={optionsAsTeacher}
                      onClick={({ option }) =>
                        handleSelectOption({
                          option,
                          user
                        })
                      }
                    />
                  </TableHeader>
                </TableRow>
              ))}
            </Management>
          </Col>
        </Row>
      </ErrorHandler>
      <ModalDialog
        textHeader={getTextHeaders()}
        onCloseRequest={setOptions}
        enabled={options}
      >
        {renderModalContent()}
      </ModalDialog>
    </Template>
  )
}

/**
 * @description
 * Readonly rows for display UI data.
 */
const rows = Object.freeze(['#', 'Nombre', 'Email', 'Controls'])

/**
 * @description
 * Controls for rendering context.
 */
const controls = {
  MEET: 'MEET',
  ASSIGN: 'ASSIGN',
  MAIL: 'MAIL',
  INFO: 'INFO'
}

/**
 * @description
 * Display UI Options with this in user table.
 */
const optionsAsUser = [
  {
    eventKey: controls.ASSIGN,
    icon: creditCardAlt,
    name: 'Asignar Paquete'
  },
  {
    eventKey: controls.MAIL,
    icon: ic_mail,
    name: 'Recuperar Contraseña'
  },
  {
    eventKey: controls.INFO,
    icon: ic_assignment_ind,
    name: 'Ver Detalles'
  }
]

const optionsAsTeacher = [
  {
    eventKey: controls.MAIL,
    icon: ic_mail,
    name: 'Recuperar Contraseña'
  },
  {
    eventKey: controls.MEET,
    icon: videoCamera,
    name: 'Videollamada'
  }
]

export default AdminView
