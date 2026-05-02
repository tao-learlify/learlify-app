import { Bind } from 'decorators'
import { Socket } from 'modules'
import { Logger } from 'api/logger'
import { MEETING_STATUS } from 'gateways/events'
import { ScheduleService } from 'api/schedule/schedule.service'

import type { Socket as SocketIO } from 'socket.io'

type MeetingStatusPayload = {
  schedule: {
    id: number
  }
  room: string
}

class MeetingsGateway extends Socket {
  public logger: typeof Logger.Service
  private scheduleService: ScheduleService

  constructor() {
    super()
    this.logger = Logger.Service
    this.scheduleService = new ScheduleService()
  }

  @Bind
  public main(): void {
    this.socket.on('connection', (socket: SocketIO) => {
      this.logger.info('MeetingsGateway: connected')

      socket.on(MEETING_STATUS, async (payload: MeetingStatusPayload) => {
        this.logger.debug('payload', payload)

        try {
          const isStream = await this.scheduleService.getOne({
            id: payload.schedule.id,
            streaming: true
          })

          if (isStream) {
            this.logger.info(
              `${payload.room} is still having a connection in the meeting.`
            )

            this.socket.to(payload.room).emit(MEETING_STATUS, {
              connected: true,
              room: payload.room
            })
          } else {
            this.logger.info(
              `${payload.room} is not having a connection anymore in the meeting.`
            )

            this.socket.to(payload.room).emit(MEETING_STATUS, {
              disconnected: true,
              room: payload.room
            })
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
    })
  }
}

export default MeetingsGateway
