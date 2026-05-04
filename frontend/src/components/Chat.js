import React, { memo, useState } from 'react'
import 'assets/css/chat.css'
import { Animated } from 'react-animated-css'
import { Button } from 'components/ui'
import { v4 as uuid } from 'uuid'
import { sendO as send } from 'react-icons-kit/fa/sendO'
import { minus as hide } from 'react-icons-kit/fa/minus'
import Icon from 'react-icons-kit'
import clsx from 'clsx'
import Text from './Text'
import moment from 'moment'

import useAuthProvider from 'hooks/useAuthProvider'
import useForm from 'hooks/useForm'
import FileUploader from './FileUploader'

import { img } from 'assets/compat'
import { ellipsis } from 'utils/functions'

function Container({ children, className, ...rest }) {
  return <div className={clsx('tw:fixed tw:bottom-0 tw:right-6 tw:w-[300px] tw:text-xs', className)} {...rest}>{children}</div>
}

function Header({ children, className, ...rest }) {
  return <header className={clsx('tw:bg-[#293239] tw:rounded-t-[5px] tw:text-white tw:cursor-pointer tw:px-[22px] tw:py-[11px]', className)} {...rest}>{children}</header>
}

function ChatBody({ children, className, ...rest }) {
  return <div className={clsx('tw:z-40 tw:bg-white', className)} {...rest}>{children}</div>
}

function ChatScreen({ children, className, ...rest }) {
  return <div className={clsx('tw:h-[260px] tw:overflow-y-scroll tw:px-6 tw:py-2', className)} {...rest}>{children}</div>
}

function MessageContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:my-4', className)} {...rest}>{children}</div>
}

function ChatAvatar({ className, ...rest }) {
  return <img className={clsx('tw:rounded-full tw:float-left', className)} {...rest} />
}

function Content({ children, className, ...rest }) {
  return <div className={clsx('tw:ml-14', className)} {...rest}>{children}</div>
}

function TextDate({ children, className, ...rest }) {
  return <span className={clsx('tw:float-right tw:text-[9.5px]', className)} {...rest}>{children}</span>
}

function ChatMessage({ children, className, ...rest }) {
  return <p className={clsx('tw:m-0 tw:mb-1.5 tw:text-[11px]', className)} {...rest}>{children}</p>
}

function ChatAction({ children, className, ...rest }) {
  return <p className={clsx('tw:text-[10px] tw:italic tw:m-0 tw:ml-20', className)} {...rest}>{children}</p>
}

function ChatFormContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:p-6', className)} {...rest}>{children}</div>
}

function ChatDivisor({ className, ...rest }) {
  return <hr className={clsx('tw:mt-1 tw:bg-[#e9e9e9] tw:border-0 tw:h-px tw:m-0', className)} {...rest} />
}

function InputDivisor({ className, ...rest }) {
  return <span className={clsx('tw:mx-[5px]', className)} {...rest} />
}

function Close({ children, className, ...rest }) {
  return <span className={clsx('tw:text-white tw:block tw:float-right tw:text-[10px] tw:h-4 tw:leading-4 tw:mt-0.5 tw:text-center tw:w-4', className)} {...rest}>{children}</span>
}

function UnreadMessages({ children, className, ...rest }) {
  return <span className={clsx('tw:bg-[#e62727] tw:border tw:border-white tw:rounded-full tw:hidden tw:text-xs tw:font-bold tw:h-7 tw:leading-7 tw:absolute tw:text-center tw:top-0 tw:w-7 tw:left-0 tw:-mt-[15px] tw:-ml-[15px]', className)} {...rest}>{children}</span>
}

function FileUpload({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-[7.5px] tw:mb-[7.5px] tw:flex tw:justify-center', className)} {...rest}>{children}</div>
}

function FileDownload(props) {
  return <a {...props} />
}

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
            <form encType="multipart/form-data" className="tw:flex tw:flex-wrap tw:items-center" onSubmit={handleSubmitMessage}>
                <div className="input-group tw:flex tw:items-center">
                  <input
                    className="form-control tw:w-1/2 tw:rounded-lg tw:border tw:border-gray-300 tw:p-1.5 tw:text-xs chat focus:tw:border-[#58CC02]"
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
                </div>
              </form>
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
