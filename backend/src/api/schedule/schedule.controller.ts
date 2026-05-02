import type { Request, Response } from 'express'
import { Bind } from 'decorators'
import { ConfigService } from 'api/config/config.service'
import { UsersService } from 'api/users/users.service'
import { MailService } from 'api/mails/mails.service'
import { ScheduleService } from './schedule.service'
import { NotFoundException, ForbiddenException } from 'exceptions'
import { Logger } from 'api/logger'
import moment from 'moment'

type ScheduleControllerProps = {
  daysOffset: number
  format: string
}

type CreatedSchedule = {
  teacher: {
    email: string
    firstName: string
  }
  startDate: string
  enDate: string
  [key: string]: unknown
}

type StreamSchedule = {
  anticipatedStartDate: string
  startDate: string
  endDate: string
  id: number
}

type StreamClass = {
  schedule?: StreamSchedule
}

type StreamMeeting = {
  classes: StreamClass[]
}

class ScheduleController {
  configService: ConfigService
  mailService: MailService
  scheduleService: ScheduleService
  usersService: UsersService
  props: ScheduleControllerProps
  logger: typeof Logger.Service

  constructor() {
    this.configService = new ConfigService()
    this.mailService = new MailService()
    this.scheduleService = new ScheduleService()
    this.usersService = new UsersService()
    this.props = {
      daysOffset: 14,
      format: 'YYYY-MM-DD HH:mm:ss'
    }
    this.logger = Logger.Service
  }

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as Record<string, unknown>
    const { format } = this.props
    const { provider } = this.configService

    const schedule = (await this.scheduleService.create({
      ...data,
      anticipatedStartDate: moment(data.startDate as never)
        .subtract(10, 'minutes')
        .format(format)
    })) as CreatedSchedule

    await this.mailService.sendMail({
      from: provider.SES_FROM_EMAIL,
      to: schedule.teacher.email,
      text: 'Te hemos asignado un horario disponible para AptisGo',
      subject: 'Te hemos asignado un horario disponible para AptisGo',
      html: `
          <div>
            Hola ${
              schedule.teacher.firstName
            }, aquí están los detalles de tu horario
            <ul>
              <li><b>Fecha de inicio</b>: ${moment(schedule.startDate).format(
                format
              )} </li>  
              <li><b>Fecha de culminación</b>: ${moment(schedule.enDate).format(
                format
              )} </li>
            </ul>
          </div>
        `
    })

    return res.status(201).json({
      message: 'Schedule has been created succesfully',
      response: schedule,
      statusCode: 201
    })
  }

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    this.logger.debug('Timezone', { timezone: req.timezone })

    const { userId, langId } = req.query
    const { daysOffset, format } = this.props

    if (userId || langId) {
      const schedules = (await this.scheduleService.getAll({
        date: {
          startDate: moment().subtract(daysOffset, 'days').format(format),
          endDate: moment().add(daysOffset, 'days').format(format)
        },
        userId,
        langId
      })) as Array<{ startDate: string; endDate: string }>

      this.logger.debug('Schedule', {
        total: schedules.length
      })

      return res.status(200).json({
        message: 'Schedule obtained successfully',
        response: schedules.map(schedule =>
          ScheduleService.scheduleTimezoneConversion(
            schedule,
            req.timezone as string
          )
        ),
        statusCode: 200
      })
    }

    const schedules = (await this.scheduleService.getAll({
      date: {
        startDate: moment().subtract(daysOffset, 'days').format(format),
        endDate: moment().add(daysOffset, 'days').format(format)
      }
    })) as Array<{ startDate: string; endDate: string }>

    this.logger.debug('Schedule', {
      total: schedules.length
    })

    return res.status(200).json({
      message: 'Schedule obtained successfully',
      response: schedules.map(schedule =>
        ScheduleService.scheduleTimezoneConversion(
          schedule,
          req.timezone as string
        )
      ),
      statusCode: 200
    })
  }

  @Bind
  async remove(req: Request, res: Response): Promise<Response> {
    const id = req.params.id

    const schedule = (await this.scheduleService.getOne({
      id
    })) as { classes?: unknown }

    if (schedule.classes) {
      throw new ForbiddenException()
    }

    if (schedule) {
      await this.scheduleService.remove(id)

      return res.status(200).json({
        message: 'Schedule has been deleted succesfully',
        response: {
          deleted: id
        },
        statusCode: 200
      })
    }

    throw new NotFoundException(res.__('errors.Schedule Not Found'))
  }

  async update(req: Request, res: Response): Promise<Response> {
    const data = req.body as {
      id: unknown
      [key: string]: unknown
    }

    const schedule = await this.scheduleService.getOne({
      id: data.id
    })

    if (schedule) {
      const update = await this.scheduleService.updateOne(data)

      return res.status(201).json({
        message: 'Update successfully',
        response: update,
        statusCode: 201
      })
    }

    throw new NotFoundException(res.__('errors.Schedule Not Found'))
  }

  @Bind
  async earlyStream(req: Request, res: Response): Promise<Response> {
    const user = req.user!.id

    const stream = (await this.scheduleService.getStream(user)) as StreamMeeting[]

    this.logger.info('stream', {
      stream: stream ? 'User has active meeting' : 'Inactive Meetings'
    })

    const lastStreamActive = stream.find(({ classes }: StreamMeeting) => {
      const [current] = classes
      const schedule = current.schedule

      if (schedule) {
        return (
          moment()
            .utc()
            .isBetween(schedule.anticipatedStartDate, schedule.endDate) ||
          moment().utc().isBetween(schedule.startDate, schedule.endDate)
        )
      }

      return undefined
    })

    this.logger.info('lastStream', lastStreamActive)

    if (lastStreamActive) {
      const schedule = await this.scheduleService.getOne({
        id: lastStreamActive.classes[0].schedule!.id
      })

      return res.status(200).json({
        response: schedule,
        statusCode: 200
      })
    }

    return res.status(200).json({
      response: null,
      statusCode: 200
    })
  }
}

export { ScheduleController }
