import React, { memo, useState } from 'react'
import 'assets/css/chat.css'
import { Animated } from 'react-animated-css'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import { sendO as send } from 'react-icons-kit/fa/sendO'
import { minus as hide } from 'react-icons-kit/fa/minus'
import Icon from 'react-icons-kit'
import styled from 'styled-components'
import Text from './Text'
import moment from 'moment'

import useAuthProvider from 'hooks/useAuthProvider'
import useForm from 'hooks/useForm'
import FileUploader from './FileUploader'

import { img } from 'assets/compat'
import { ellipsis } from 'utils/functions'

const Container = styled.div`
  bottom: 0;
  font-size: 12px;
  right: 24px;
  position: fixed;
  width: 300px;
`

const Header = styled.header`
  background: #293239;
  border-radius: 5px 5px 0 0;
  color: #fff;
  cursor: pointer;
  padding: 11px 22px;
`

const ChatBody = styled.div`
  z-index: 40;
  background: #fff;
`

const ChatScreen = styled.div`
  height: 260px;
  padding: 8px 24px;
  overflow-y: scroll;
`

const MessageContainer = styled.div`
  margin: 16px 0;
`

const ChatAvatar = styled.img`
  border-radius: 50%;
  float: left;
`

const Content = styled.div`
  margin-left: 56px;
`

const TextDate = styled.span`
  float: right;
  font-size: 9.5px;
`

const ChatMessage = styled.p`
  margin: 0;
  margin-bottom: 5px;
  font-size: 11px;
`

const ChatAction = styled.p`
  font-size: 10px;
  font-style: italic;
  margin: 0 0 0 80px;
`

const ChatFormContainer = styled.div`
  padding: 24px;
`

const ChatDivisor = styled.hr`
  margin-top: 4px;
  background: #e9e9e9;
  border: 0;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  height: 1px;
  margin: 0;
  min-height: 1px;
`

const InputDivisor = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`

const Close = styled.span`
  color: #fff;
  display: block;
  float: right;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  margin: 2px 0 0 0;
  text-align: center;
  width: 16px;
`

const UnreadMessages = styled.span`
  background: #e62727;
  border: 1px solid #fff;
  border-radius: 50%;
  display: none;
  font-size: 12px;
  font-weight: bold;
  height: 28px;
  left: 0;
  line-height: 28px;
  margin: -15px 0 0 -15px;
  position: absolute;
  text-align: center;
  top: 0;
  width: 28px;
`

const FileUpload = styled.div`
  margin-top: 7.5px;
  margin-bottom: 7.5px;
  display: flex;
  justify-content: center;
`

const FileDownload = styled.a``

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
 * @property {boolean} open
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
  open,
  onSendMessage,
  onSwitch,
  onTyping,
  unreads
}) => {
  
  const user = useAuthProvider()

  const [form, onChange, reset] = useForm({
    message: ''
  })

  const [attach, setAttach] = useState()

  const renderMessages = () => {
    if (messages.length === 0) {
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
          src={message.urlImage ? message.urlImage : img['user-male']}
        />
        <Content className="chat">
          <TextDate>{moment(message.date).format('HH:mm a')}</TextDate>
          <Text color="muted" tag="h5">
            {message.userId === user.profile.id ? 'Tú' : message.sender}:
          </Text>
          <ChatMessage>
            {message.attach ? (
              <FileDownload href={message.attach} download={message.filename}>
                {ellipsis(message.filename, 0, 25)}
              </FileDownload>
            ) : (
              <Text color="secondary" tag="span">
                {typeof message.text === 'string' && message.text}
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
    <Container className="border rounded">
      <Header className="chat" onClick={onSwitch}>
        <Close onClick={onSwitch}>
          <Icon icon={hide} onClick={onSwitch} />
        </Close>
        <Text color="light" tag="h4">
          AptisGo Meeting Chat
        </Text>
      </Header>
      <Animated isVisible={open} animationIn="fadeIn" animationOut="fadeOutUp">
        {unreads !== 0 && <UnreadMessages>{unreads}</UnreadMessages>}
        {open && (
          <Animated isVisible animationIn="fadeIn">
            <ChatBody className="chat">
              <ChatScreen>{renderMessages()}</ChatScreen>
              <Animated
                isVisible={Boolean(action)}
                animationIn="fadeIn"
                animationOut="fadeOut"
              >
                <ChatAction>{Boolean(action) && action}</ChatAction>
              </Animated>
            </ChatBody>
            <ChatFormContainer>
              <FileUpload>
                <Text center tag="small" color="muted">
                  {Boolean(attach) && ellipsis(attach.name, 0, 30)}
                </Text>
              </FileUpload>
              <Form encType="multipart/form-data" inline onSubmit={handleSubmitMessage}>
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
                  />
                  <InputDivisor />
                  <FileUploader
                    onChange={handleAttachFile}
                    renderEncType={false}
                  />
                  <InputDivisor />
                  <Button
                    className="rounded"
                    type="submit"
                    size="sm"
                    variant="dark"
                  >
                    <Icon icon={send} />
                  </Button>
                </InputGroup>
              </Form>
            </ChatFormContainer>
          </Animated>
        )}
      </Animated>
    </Container>
  )
}

Chat.defaultProps = {
  messages: [],
  onSendMessage: () => null
}

export default memo(Chat)
