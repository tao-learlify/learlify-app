import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import useAuthProvider from 'hooks/useAuthProvider'
import useSettings from 'hooks/useSettings'

import Root from 'components/Root'
import Stripe from 'components/Stripe'

import WebSockets from 'providers/WebSockets'
import EventSource from 'providers/EventSource'

import { client } from 'providers/sockets'

import { fetchLanguagesThunk } from 'store/@thunks/languages'
import { fetchCategoriesThunk } from 'store/@thunks/categories'
import { fetchNotificationsThunk } from 'store/@thunks/notifications'
import { fetchModelsThunk } from 'store/@thunks/models'
import { selectModel } from 'store/@reducers/models'

const App = () => {
  const user = useAuthProvider()

  const network = useSettings({ network: true })

  const dispatch = useDispatch()

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(fetchModelsThunk()).then(action => {
        if (user.profile.model) {
          dispatch(selectModel(user.profile.model))
        } else if (action?.payload?.response?.length > 0) {
          dispatch(selectModel(action.payload.response[0]))
        }
      })
    }
  }, [dispatch, user.isLoggedIn, user.profile])

  /**
   * @description
   * Fetching categories
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(fetchCategoriesThunk())
    }

    return () => {
      client.disconnect()
    }
  }, [dispatch, user.isLoggedIn])

  /**
   * @description
   * Fetching notifications
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(fetchNotificationsThunk())
    }
  }, [dispatch, user.isLoggedIn])

  /**
   * @description
   * Fetching
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(fetchLanguagesThunk())
    }
  }, [dispatch, user.isLoggedIn])

  return network ? (
    <Stripe>
      <WebSockets>
        <EventSource>
          <Root />
        </EventSource>
      </WebSockets>
    </Stripe>
  ) : (
    <WebSockets>
      <EventSource>
        <Root />
      </EventSource>
    </WebSockets>
  )
}

export default App
