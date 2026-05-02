/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useLayoutEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useDebouncedCallback } from 'use-debounce'
import { useDispatch } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import { unwrapResult } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { TOAST_EXPIRATION } from 'constant'

import useAuthProvider from 'hooks/useAuthProvider'
import useClasses from 'hooks/useClasses'
import useChat from 'hooks/useChat'
import useHttpClient from 'hooks/useHttpClient'
import useInterval from 'hooks/useInterval'
import useQueryValidation from 'hooks/useQueryValidation'
import useQuery from 'hooks/useQuery'
import useSocket from 'hooks/useSocket'
import useSounds from 'hooks/useSounds'
import useToggler from 'hooks/useToggler'

import Animate from 'components/Animate'
import Countdown from 'react-countdown'
import Chat from './components/chat/Chat'
import ClassRoom from './components/classRoom/ClassRoom'
import FlexContainer from 'components/FlexContainer'
import Template from 'components/Template'
import Text from 'components/Text'

import PATH from 'utils/path'
import { ChatContext, ControlsContext } from 'store/context'
import { EXPIRE_CLASS_ROOM } from 'providers/events/socket'

import roles from 'utils/roles'
import { WHITE } from 'assets/colors'
import { fetchClassRoomThunk } from 'store/@thunks/classes'
import { endClassRoomConnection } from 'store/@reducers/classes'
import { fetchOutgoingClassThunk } from 'store/@thunks/schedules'
import { img } from 'assets/img'
import { GET } from 'providers/http'

/**
 * @type {number}
 * @description
 * This will make a emit for the socket to check the status of meeting.
 * Equivalent to 2 minutes per request.
 */
const checkMeetingConnectionInterval = 1000 * 60 * 2

/**
 * @description
 * Endpoint of meetings.
 */
const endpoint = '/api/v1/meetings'

const Meetings = () => {
  const { t } = useTranslation()

  /**
   * @description
   * Getting "token" query parameter from the browser.
   */
  const { token: room } = useQuery()

  /**
   * @description
   * Getting the current chat process on the socket.
   */
  const chat = useChat({ room })

  /**
   * @description
   * Use socket utility to reference on the component.
   */
  const socket = useSocket()

  /**
   * @description
   * To dispatch redux actions to the store.
   */
  const dispatch = useDispatch()

  /**
   * @description
   * For making sounds through socket when a user connect to the video meet.
   */
  const sounds = useSounds()

  /**
   * @description
   * Ref to the current user session.
   */
  const user = useAuthProvider()

  /**
   * @description
   * History of router.
   */
  const history = useHistory()

  /**
   * @description
   * Fetching the current information of the meeting process.
   */
  const meeting = useHttpClient({
    endpoint,
    queries: {
      room
    },
    method: GET,
    requiresAuth: true
  })

  const classes = useClasses()

  const [active, setIsActive] = useToggler(true)

  const [debounce] = useDebouncedCallback(chat.onTypingMessage, 1000)

  /**
   * @description
   * After rendering dom content, use layout effect to change the style of the body content.
   */
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#2C3E50'

    return () => {
      document.body.style.backgroundColor = WHITE
    }
  }, [])

  /**
   * @description
   * Fetching class room information.
   */
  const fetchClassRoom = () => {
    dispatch(fetchClassRoomThunk({ token: room }))
      .then(unwrapResult)
      .then(() => dispatch(fetchOutgoingClassThunk()))
      .catch(({ message }) => {
        ToastsStore.warning(message)

        history.push(PATH.DASHBOARD)
      })
  }

  /**
   * @description
   * Socket ref connection.
   * @requires EXPIRE_CLASS_ROOM event, to takes a payload from the server.
   */
  const socketRef = useCallback(() => {
    if (active) {
      /**
       * @description
       * Check that the current schedule has been expired.
       */
      socket.on(EXPIRE_CLASS_ROOM, payload => {
        console.info('ping', payload)

        if (payload.room === room) {
          setIsActive(false)
        }
      })
    }
  }, [active, room, setIsActive, socket])

  /**
   * @description
   * If the class is not longer active, we support at least 5 minutes extras.
   * To close the class connection automatically.
   */
  const classConnection = () => {
    if (!active) {
      ToastsStore.warning(t('TOAST_NOTIFICATION.minutesLeft'), TOAST_EXPIRATION)

      sounds.play('ping')
    }
  }
  /**
   * @description
   * Fetch the classRoom.
   */
  useEffect(fetchClassRoom, [meeting.data])

  /**
   * @description
   * This hook will allow to check if the class has the given extra minutes.
   */
  useEffect(classConnection, [active])

  /**
   * @description
   * When meeting status is checked, run this handler.
   */
  useEffect(socketRef, [active])

  /**
   * @description
   * If the token is not present, we should throw an exception and redirect.
   */
  useQueryValidation(
    {
      required: ['token']
    },
    exception => {
      if (exception) {
        history.push(PATH.DASHBOARD)
      }
    }
  )

  /**
   * @description
   * Every @checkMeetingConnectionInterval period will check the status of the meeting.
   */
  useInterval(() => {
    if (socket.disconnected) {
      ToastsStore.warning(
        t('TOAST_NOTIFICATION.serverProblem'),
        TOAST_EXPIRATION
      )

      history.push(PATH.DASHBOARD)
    }
  }, checkMeetingConnectionInterval)

  /**
   * @description
   * When the user press a keyboard is about to send a message in the chat.
   * Every user in the meeting can check that the user is actually typing a message.
   * This action should be delayed with a debounce to prevent multiple rendering content.
   * @requires useDebounce to increase perfomance.
   * @param {import ('components/Chat').Typing} message
   */
  const onTypingMessage = message => {
    debounce(message)
  }

  /**
   * @description
   * When the meet ends we push to a path called "Quality" that the user must be fill how good the meeting was.
   * Dispatch also an event called endClassRoomConnection.
   * @return {void}
   */
  const handleEndClass = () => {
    sounds.play('ping', { volume: 0.5 })

    ToastsStore.success(t('TOAST_NOTIFICATION.classEnded'), TOAST_EXPIRATION)

    dispatch(endClassRoomConnection())

    /**
     * @description
     * Doesn't require the feedback if user is a teacher.
     */
    if (user.profile.role === roles.TEACHER) {
      return history.push(PATH.DASHBOARD)
    }

    history.push({
      pathname: PATH.QUALITY,
      state: {
        feedback: true
      },
      search: `?token=${room}`
    })
  }

  /**
   * @constant
   * @description
   * Render time to countdown date.
   */
  const COUNTDOWN = Date.now() + 1000 * 60 * 4

  /**
   * @requires i18next
   * @description
   * Message that appears when meeting is being loaded.
   */
  const pendingStreamingCallMessage = t('TOAST_NOTIFICATION.preparingStreaming')

  /**
   * @requires i18next
   * @description
   * Message that appears when the meeting is about the end soon.
   */
  const pendingStreamingToBeEndedMessage = t('TOAST_NOTIFICATION.automaticallyEnd')

  return (
    <Template
      withLoader={classes.loading || meeting.loading}
      loaderIndicatorName={pendingStreamingCallMessage}
    >
      {meeting.data.token && (
        <Animate>
          {active || (
            <Alert variant="warning">
              <Alert.Heading>
                <Text bold center tag="h5">
                  {pendingStreamingToBeEndedMessage} <img alt="timer" src={img.time} />
                </Text>
              </Alert.Heading>
              <FlexContainer>
                <Countdown date={COUNTDOWN} onComplete={handleEndClass} />
              </FlexContainer>
            </Alert>
          )}
          <ChatContext.Provider value={chat.unreads}>
            <ControlsContext.Provider value={chat.onToggleChat}>
              <ClassRoom name={room} token={meeting.data.token} />
            </ControlsContext.Provider>
          </ChatContext.Provider>
          {chat.visible && (
            <Chat
              action={chat.typing.text}
              messages={chat.messages}
              onSendMessage={chat.onChatMessage}
              onSwitch={chat.onToggleChat}
              onTyping={onTypingMessage}
              unreads={chat.unreads}
            />
          )}
        </Animate>
      )}
    </Template>
  )
}

export default memo(Meetings)
