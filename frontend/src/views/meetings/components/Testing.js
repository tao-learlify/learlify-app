import React, { useLayoutEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import ClassRoom from './classRoom/ClassRoom'
import Chat from './chat/Chat'
import Template from 'components/Template'

import useChat from 'hooks/useChat'
import useHttpClient from 'hooks/useHttpClient'

import { MeetingContainer, ChatContainer } from './styles'
import { ChatContext, ControlsContext } from 'store/context'
import colors from 'colors'
import { GET } from 'providers/http'

/**
 * @description
 * This variable only refers to the room testing name, that is called "Client" for the server.
 */
const room = 'Client'

/**
 * @description
 * This route is different to the main route, this is an endpoint test only.
 */
const endpoint = '/api/v1/meetings/token'

/**
 * This component only renders a Testing of the current meeting.
 * @returns {React.Component}
 */
const Testing = () => {
  const chat = useChat({ room })
  
  const [debounce] = useDebouncedCallback(chat.onTypingMessage, 2000)

  useLayoutEffect(() => {
    document.body.style.backgroundColor = colors.DARKBLUE

    return () => {
      document.body.style.backgroundColor = colors.LIGHT
    }
  }, [])

  const meeting = useHttpClient({
    endpoint,
    method: GET,
    requiresAuth: true
  })

  /**
   * @param {string} typing 
   * @returns 
   */
  const onTypingMessage = typing => debounce(typing)

  return (
    <Template
      color={colors.DARKBLUE} 
      loaderIndicatorName="Preparándo Streaming"
      withLoader={meeting.loading}
      withSocket={false}
      withoutSpace
    >
      {meeting.data.token && (
        <>
          <MeetingContainer>
            <ChatContext.Provider value={chat.unreads}>
              <ControlsContext.Provider value={chat.onToggleChat}>
                <ClassRoom
                  name="Client"
                  token={meeting.data.token}
                />
              </ControlsContext.Provider>
            </ChatContext.Provider>
          </MeetingContainer>
          {chat.visible && (
            <ChatContainer>
              <Chat
                action={chat.typing.text}
                messages={chat.messages}
                onSendMessage={chat.onChatMessage}
                onSwitch={chat.onToggleChat}
                onTyping={onTypingMessage}
                unreads={chat.unreads}
              />
            </ChatContainer>
          )}
        </>
      )}
    </Template>
  )
}

export default React.memo(Testing)
