import React, { memo, useState, useRef, useEffect } from 'react'
import 'assets/css/chat.css'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import { sendO as send } from 'react-icons-kit/fa/sendO'
import { minus as hide } from 'react-icons-kit/fa/minus'
import Icon from 'react-icons-kit'

import moment from 'moment'

import useAuthProvider from 'hooks/useAuthProvider'
import useForm from 'hooks/useForm'

import {
  ChatContainer,
  Header,
  ChatBody,
  ChatScreen,
  MessageContainer,
  ChatAvatar,
  Content,
  TextDate,
  ChatMessage,
  ChatAction,
  ChatFormContainer,
  ChatDivisor,
  InputDivisor,
  Close,
  UnreadMessages,
  FileUpload,
  FileDownload
} from './styles'

import Text from 'components/Text'
import LinkThrough from 'components/LinkThrough'
import FileUploader from 'components/FileUploader'
import MaleImage from 'assets/illustrations/pandas/panda.svg'
import ErrorHandler from 'views/errors'
import { ellipsis, isHyperLink } from 'utils/functions'

/**
 * @typedef {Object} ChatMessage
 * @property {string} urlImage
 * @property {string} text
 * @property {number} userId
 * @property {string} id
 * @property {Date} date
 * @property {string} sender
 */

/**
 * @typedef {Object} Typing
 * @property {string} text
 */

/**
 * @typedef {Object} ChatProps
 * @property {Typing} action
 * @property {Array<ChatMessage>} messages
 * @property {(message: ChatMessage) => ChatMessage} onSendMessage
 * @property {(typing: Typing) => Typing} onTyping
 * @property {() => void} onSwitch
 * @property {number} unreads
 */

/**
 * @type {React.FunctionComponent<ChatProps>}
 */
const Chat = ({
  action,
  messages,
  onSendMessage,
  onSwitch,
  onTyping,
  unreads
}) => {
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const user = useAuthProvider()

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])

  const [form, onChange, reset] = useForm({
    message: ''
  })

  const [attach, setAttach] = useState()

  const renderMessages = () => {
    const emptyMessages = messages.length === 0

    if (emptyMessages) {
      return (
        <Text color="muted" center tag="p">
          No tienes mensajes en esta conversación
        </Text>
      )
    }

    return messages.map(message => (
      <MessageContainer key={message.id} className="chat">
        <ChatAvatar
          width={28}
          height={28}
          src={message.urlImage ? message.urlImage : MaleImage}
        />
        <Content className="chat">
          <TextDate>{moment(message.date).format('HH:mm a')}</TextDate>
          <Text color="light" tag="h5">
            {message.userId === user.profile.id ? 'Tú' : message.sender}:
          </Text>
          <ChatMessage>
            {message.attach && typeof message.attach === 'string' ? (
              <FileDownload href={message.attach} download={message.filename}>
                {ellipsis(message.filename, 0, 25)}
              </FileDownload>
            ) : isHyperLink(message.text) ? (
              <LinkThrough className="text-info p" tag="a" href={message.text}>
                {message.text}
              </LinkThrough>
            ) : (
              <Text color="light" tag="span">
                {message.text}
              </Text>
            )}
          </ChatMessage>
        </Content>
        <ChatDivisor />
      </MessageContainer>
    ))
  }

  /**
   *
   * @param {React.FormEvent<HTMLInputElement>} e
   */
  const handleSubmitMessage = e => {
    e.preventDefault()

    reset()

    if (attach) {
      setAttach()
    }

    onSendMessage({
      attach: attach,
      date: moment(),
      id: uuid(),
      userId: user.profile.id,
      urlImage: user.profile.imageUrl,
      sender: user.profile.firstName,
      text: form.message
    })
  }

  const handleTyping = () => {
    onTyping({
      text: `${user.profile.firstName} está escribiendo..`
    })
  }

  const handleAttachFile = file => {
    setAttach(file)
  }

  return (
    <ErrorHandler>
      <ChatContainer className="border rounded">
        <Header className="chat" onClick={onSwitch}>
          <Close onClick={onSwitch}>
            <Icon icon={hide} onClick={onSwitch} />
          </Close>
          <Text color="light" tag="h4">
            AptisGo Meeting Chat
          </Text>
        </Header>
        {unreads !== 0 && <UnreadMessages>{unreads}</UnreadMessages>}
        <ChatBody className="chat">
          <ChatScreen ref={chatRef}>{renderMessages()}</ChatScreen>
          <ChatAction>{action && action}</ChatAction>
        </ChatBody>
        <ChatFormContainer>
          <FileUpload>
            <Text center tag="small" color="muted">
              {attach && ellipsis(attach.name, 0, 30)}
            </Text>
          </FileUpload>
          <Form
            encType="multipart/form-data"
            inline
            onSubmit={handleSubmitMessage}
          >
            <InputGroup>
              <Form.Control
                className="w-50 rounded chat"
                name="message"
                onChange={onChange}
                onKeyPress={handleTyping}
                onKeyDown={handleTyping}
                placeholder="Escribe un mensaje..."
                size="sm"
                value={form.message}
                required
                ref={inputRef}
              />
              <InputDivisor />
              <FileUploader onChange={handleAttachFile} renderEncType={false} />
              <InputDivisor />
              <Button className="rounded" type="submit" size="sm">
                <Icon icon={send} />
              </Button>
            </InputGroup>
          </Form>
        </ChatFormContainer>
      </ChatContainer>
    </ErrorHandler>
  )
}

Chat.defaultProps = {
  messages: [],
  onSendMessage: () => null,
  onSwitch: () => null,
  onTyping: () => null
}

export default memo(Chat)
