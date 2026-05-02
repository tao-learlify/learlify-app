/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useReducer } from 'react'
import { v4 } from 'uuid'

import useAuthProvider from './useAuthProvider'
import useSocket from './useSocket'
import useSounds from './useSounds'
import useToggler from './useToggler'
import chatReducer, { initialState } from 'state/hooks/chat'

import { fileReader } from 'utils/functions'
import { FILE_ATTACH_STREAM, FILE_UPLOAD_STREAM } from 'providers/events/stream'
import { chatMessage, chatTyping, chatUnreads } from 'state/hooks/chat/actions'
import {
  CHAT_MESSAGE,
  TYPING_MESSAGE,
  JOIN_CHAT_ROOM
} from 'providers/events/socket'


import httpClient from 'utils/httpClient'


/**
 * @typedef {Object} UseChatHook
 * @property {boolean} visible
 * @property {() => void} onChatMessage
 * @property {() => void} onTypingMessage
 * @property {() => void} onToggleChat
 */

 /**
  * @typedef {Object} UseChatArguments
  * @property {string} room
  */

/**
 * @param {UseChatArguments}
 * @returns {UseChatHook}
 */
function useChat({ room }) {
  const user = useAuthProvider()

  const socket = useSocket()

  const sounds = useSounds()

  const [state, dispatch] = useReducer(chatReducer, initialState)

  const [visible, toggle] = useToggler(false)

  const refSocket = useCallback(() => {
    /**
     * @description
     * When a user enters to chatroom.
     */
    socket.emit(JOIN_CHAT_ROOM, {
      user: user.profile.id,
      room
    })
    /**
     * @description
     * When client takes a chat message.
     */
    socket.on(CHAT_MESSAGE, payload => {
      const chatIsToggledOff = !visible
      
      sounds.play('notification', { volume: 0.3 })

      dispatch(
        chatMessage({
          ...payload.message,
          room
        })
      )

      if (chatIsToggledOff) {
        dispatch(chatUnreads(state.unreads + 1))
      }
    })

    /**
     * @description
     * Uses takes a binary file in the chat.
     */
    socket.on(FILE_ATTACH_STREAM, payload => {
      if (payload.room === room) {
        httpClient({
          endpoint: payload.stream.attach,
          external: true,
          response: 'blob',
          method: 'GET'
        }).then(file => {
          sounds.play('notification', { volume: 0.3 })

          dispatch(
            chatMessage({
              ...payload.stream,
              attach: URL.createObjectURL(file),
              id: v4()
            })
          )
        })
      }
    })

    /**
     * @description
     * When a client takes a typing message.
     */
    socket.on(TYPING_MESSAGE, payload => {
      if (payload.room === room) {
        const typingRef = {
          timer: null,
          expireTime: 2000
        }

        dispatch(chatTyping(payload.message))

        typingRef.timer = setTimeout(() => {
          dispatch(chatTyping(null))

          clearTimeout(typingRef.timer)
        }, typingRef.expireTime)
      }
    })

    /**
     * @description
     * Debug level production.
     */
    socket.on(JOIN_CHAT_ROOM, payload => {
      console.info('connected', payload)
    })
  }, [room, socket, state.unreads, user.profile, visible])

  useEffect(refSocket, [socket])

  const onChatMessage = useCallback(
    /**
     * @param {import ('views/meetings/Chat').Message}
     * @param {string} room
     */
    async message => {
      console.debug('room', message)

      if (message.attach) {
        const base64 = await fileReader(message.attach, 'readAsDataURL')

        /**
         * @description
         * Recreating the message.
         */
        const stream = {
          ...message,
          attach: base64,
          filename: message.attach.name,
          id: v4()
        }

        socket.emit(FILE_UPLOAD_STREAM, {
          room,
          stream
        })

        dispatch(chatMessage(stream))
      }

      dispatch(chatMessage(message))

      socket.emit(CHAT_MESSAGE, {
        message,
        room
      })
    },
    [socket, room]
  )

  const onTypingMessage = useCallback(
    /**
     * @param {{ text?: string }} payload
     */
    payload => {
      if (payload) {
        socket.emit(TYPING_MESSAGE, {
          message: payload.text,
          room
        })
      }
    },
    [room, socket]
  )

  /**
   * @description
   * Toggles and makes to 0 unreads.
   */
  const onToggleChat = () => {
    dispatch(chatUnreads(0))

    return toggle()
  }

  return {
    ...state,
    visible,
    onChatMessage,
    onTypingMessage,
    onToggleChat
  }
}

export default useChat
