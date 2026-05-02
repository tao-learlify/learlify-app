import type { Socket as SocketIO } from 'socket.io'
import { Socket } from 'modules'
import { Logger } from 'api/logger'
import {
  CHAT_MESSAGE,
  TYPING_MESSAGE,
  JOIN_CHAT_ROOM,
  FILE_ATTACH_STREAM,
  FILE_UPLOAD_STREAM
} from 'gateways/events'

type ChatPayload = {
  room: string
  message?: unknown
  [key: string]: unknown
}

export default class ChatGateway extends Socket {
  public logger: typeof Logger.Service

  constructor() {
    super()
    this.logger = Logger.Service
  }

  public main(): void {
    this.socket.on('connection', (socket: SocketIO) => {
      this.logger.info('ChatGateway: connected')

      socket.on(CHAT_MESSAGE, (payload: ChatPayload) => {
        this.logger.debug('Chat Message Emited: ', {
          room: payload.room,
          payload: payload.message,
        })

        socket.to(payload.room).emit(CHAT_MESSAGE, payload)
      })

      socket.on(TYPING_MESSAGE, (payload: ChatPayload) => {
        this.logger.debug('Typing Message Event: ', {
          room: payload.room,
          payload: payload.message,
        })

        socket.to(payload.room).emit(TYPING_MESSAGE, payload)
      })

      socket.on(FILE_UPLOAD_STREAM, (payload: ChatPayload) => {
        this.logger.debug('Attaching File Event: ', {
          room: payload.room,
          payload: payload.message,
        })

        socket.to(payload.room).emit(FILE_ATTACH_STREAM, payload)
      })

      socket.on(JOIN_CHAT_ROOM, (payload: ChatPayload) => {
        socket.join(payload.room)
        
        this.socket.to(payload.room).emit(JOIN_CHAT_ROOM, { ping: true })
      })
    })
  }
}
