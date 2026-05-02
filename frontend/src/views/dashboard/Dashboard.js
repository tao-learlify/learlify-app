import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { withVerification as WV } from 'hocs'

import useAuthProvider from 'hooks/useAuthProvider'

import AdminView from './AdminView'
import UserView from './UserView'
import TeacherView from './TeacherView'
import ErrorHandler from 'views/errors'
import roles from 'utils/roles'

import { fetchOutgoingClassThunk } from 'store/@thunks/schedules'
import FetchError from 'views/errors/FetchError'

const Dashboard = () => {
  const user = useAuthProvider()

  const dispatch = useDispatch()


  useEffect(() => {
    const outgoingStream = dispatch(fetchOutgoingClassThunk('stream'))

    return () => {
      outgoingStream.abort()
    }
  }, [dispatch])


  try {
    switch (user.profile.role.name) {
      case roles.ADMIN:
        return (
          <ErrorHandler>
            <AdminView />
          </ErrorHandler>
        )
  
      case roles.TEACHER:
        return (
          <ErrorHandler>
            <TeacherView />
          </ErrorHandler>
        )
  
      case roles.USER:
        return (
          <ErrorHandler>
            <UserView />
          </ErrorHandler>
        )
  
      default:
        return <React.Fragment />
    }
  } catch (err) {
    return <FetchError />
  }
}

export default WV(Dashboard)
