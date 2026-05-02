import type { Server, Socket as SocketIO } from 'socket.io'
import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import { UsersService } from 'api/users/users.service'
import { MeetingsService } from 'api/meetings/meetings.service'
import jwt from 'jsonwebtoken'
import config from '../config'
import ROOMS from './rooms'
import * as EVENT from './events'

type SocketModule = new () => {
  main?: () => void
}

type SessionRoom = {
  name: string
}

type SessionMeeting = {
  classes: SessionRoom[]
}

type UserAssertPayload = {
  id: number
  email: string
}

type SocketWithUser = SocketIO & {
  user?: unknown
}

export class WebSockets {
  stream: Server
  logger: typeof Logger.Service
  users: UsersService
  meetings: MeetingsService
  modules: SocketModule[]

  constructor({
    stream,
    modules
  }: {
    stream: Server
    modules: SocketModule[]
  }) {
    this.stream = stream
    this.logger = Logger.Service
    this.users = new UsersService()
    this.meetings = new MeetingsService()
    this.modules = modules || []
  }

  @Bind
  connected(id: string): string {
    return 'A client has joining to socket '.concat(id)
  }

  @Bind
  disconnected(id: string): string {
    return 'A client has been disconnected '.concat(id)
  }

  getSessionName(session: SessionMeeting): string {
    const [room] = session.classes

    return room.name
  }

  @Bind
  main(): void {
    this.logger.info('WebSockets Service Running')

    this.stream.use((socket: SocketIO, next: (err?: Error) => void) => {
      const tokenCandidate =
        socket.handshake.auth?.token || socket.handshake.query?.token

      if (!tokenCandidate) {
        return next(new Error('unauthorized'))
      }

      jwt.verify(
        String(tokenCandidate),
        config.JWT_SECRET as string,
        { algorithms: ['HS256'] },
        (err: unknown, decoded: unknown) => {
          if (err) {
            return next(new Error('unauthorized'))
          }

          const socketWithUser = socket as SocketWithUser
          socketWithUser.user = decoded
          next()
        }
      )
    })

    this.modules.forEach(Module => {
      const module = new Module()

      if ('main' in module) {
        module.main?.()
      }
    })

    this.stream.on(EVENT.CONNECTION, (socket: SocketIO) => {
      const message = this.connected(socket.id)

      this.logger.info(message)

      socket.on(EVENT.DISCONNECT, () => {
        const disconnectedMessage = this.disconnected(socket.id)
        this.logger.info(disconnectedMessage)
      })

      socket.on(EVENT.DISCONNECTING, () => {
        this.logger.info('socketRooms', [...socket.rooms])
      })

      socket.on(EVENT.USER_ASSERT, async (user: UserAssertPayload) => {
        try {
          const email = await this.users.isAvailable({ email: user.email })

          if (email) {
            await this.users.updateLastLogin(user.id)

            socket.join(user.email)

            const rooms = (await this.meetings.getActiveMeetings({
              userId: user.id
            })) as unknown as SessionMeeting[]

            this.logger.info(
              'rooms',
              rooms.length > 0 ? rooms : { inactive: true }
            )

            if (rooms) {
              rooms.forEach(room => {
                socket.join(this.getSessionName(room))
                this.logger.info('Join into', {
                  room: this.getSessionName(room)
                })

                this.stream.to(ROOMS.CLASSROOM).emit(EVENT.USER_JOIN_ROOM, {
                  connected: true,
                  rooms: rooms.map(this.getSessionName)
                })

                this.logger.info('User connection to room notifications')
              })

              this.logger.info(
                `${user.email} with socket.id ${socket.id} has joining tom ${ROOMS.CLASSROOM}`
              )
            }
          }
        } catch (err: unknown) {
          const error = err as {
            name?: string
            stack?: string
          }

          this.logger.error(String(error.name))
          this.logger.error(String(error.stack))
        }
      })

      socket.emit(EVENT.USER_ASSERT, { ping: true })

      this.logger.info('User Recognition Completed', socket.id)
    })
  }

  @Bind
  emitToRoom(room: string, event: string, ...args: unknown[]): void {
    this.stream.to(room).emit(event, ...args)
  }
}
