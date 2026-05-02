import type { Request, Response } from 'express'
import Schedule from 'api/schedule/schedule.model'
import { ClassesService } from './classes.service'
import { ConfigService } from 'api/config/config.service'
import { ScheduleService } from 'api/schedule/schedule.service'
import { PackagesService } from 'api/packages/packages.service'
import { MailService } from 'api/mails/mails.service'
import {
  NotFoundException,
  PaymentException,
  ConflictException,
  ForbiddenException,
  TransactionError
} from 'exceptions'
import { v4 as uuidv4 } from 'uuid'
import { Bind } from 'decorators'
import { Roles } from 'metadata/roles'
import { Logger } from 'api/logger'
import moment from 'moment'
import { mailConfig } from 'api/mails'
import type { CreateClassBody, IndicationsBody, ClassTransactionError } from './classes.types'

class ClassesController {
  private props: { maxHistoryLength: number }
  private classService: ClassesService
  private scheduleService: ScheduleService
  private packagesService: PackagesService
  private configService: ConfigService
  private mailsSerivce: MailService
  private logger: typeof Logger.Service

  constructor() {
    this.props = {
      maxHistoryLength: 5
    }
    this.classService = new ClassesService()
    this.scheduleService = new ScheduleService()
    this.packagesService = new PackagesService()
    this.configService = new ConfigService()
    this.mailsSerivce = new MailService()
    this.logger = Logger.Service
  }

  private get _historyEndpoint(): string {
    return '/api/v1/classes/history'
  }

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const { scheduleId, packageId } = req.body as CreateClassBody

    const indications: IndicationsBody = JSON.parse((req.body as CreateClassBody).indications)

    const pack = await this.packagesService.getOne({ id: packageId })

    const classRoom = await this.classService.getOne({ scheduleId })

    if (classRoom) {
      throw new ConflictException(res.__('errors.Room already exists'))
    }

    if (pack) {
      const doesntHavePackages = (pack as unknown as { classes: number }).classes === 0

      if (doesntHavePackages) {
        throw new PaymentException('Should adquire a new package' as unknown as { response?: unknown })
      }

      const schedule = await (this.scheduleService as unknown as { getOne(opts: { id: number }): Promise<unknown> }).getOne({ id: scheduleId })

      if (schedule) {
        const classInstance = await this.classService.create({
          package: pack as unknown as { id: number; classes: number },
          schedule: schedule as unknown as { id: number },
          user: req.user as { id: number; email: string },
          name: uuidv4(),
          notified: false,
          timezone: req.timezone
        })

        this.logger.debug('classInstance', classInstance)

        if ((classInstance as ClassTransactionError).error) {
          throw new TransactionError((classInstance as ClassTransactionError).error as unknown as string)
        }

        const classSuccess = classInstance as {
          room: unknown
          package: unknown
          meeting: unknown
          schedule: { teacher: { firstName: string; email: string } } & Record<string, unknown>
        }

        const timezone = {
          user: ScheduleService.scheduleTimezoneConversion(
            classSuccess.schedule as unknown as Schedule,
            req.timezone!
          ),
          teacher: ScheduleService.scheduleTimezoneConversion(
            classSuccess.schedule as unknown as Schedule,
            (this.configService.provider as unknown as { TZ: string }).TZ
          )
        }

        await this.mailsSerivce.sendMail({
          to: (req.user as { email: string }).email,
          from: mailConfig.email,
          text: 'Confirmación de clase',
          subject: 'Hemos confirmado tu clase',
          html: `
            <div>
              <h2>&iexcl;Ya has confirmado tu clase en AptisGo!</h2>
              <p>
              <p><strong>El d&iacute;a ${moment(timezone.user.startDate).format(
                'YYYY-MM-DD'
              )} a las ${moment(timezone.user.startDate)
            .utc()
            .format('HH:mm A')} comenzar&aacute; tu clase con el profesor ${
            classSuccess.schedule.teacher.firstName
          }.</strong></p>
                <p>Dentro de la aplicaci&oacute;n, 10 minutos antes de la hora de inicio ver&aacute;s una notificaci&oacute;n. En ella, pulsando el bot&oacute;n podr&aacute;s acceder al aula. <br />Recomendamos acceder con antelaci&oacute;n para esperar al profesor y comprobar que todo funciona correctamente.</p>
                <p>Recomendamos que antes de la clase compruebes tener:<br />
                  1. Un ordenador, con c&aacute;mara y micr&oacute;fono operativo. (Smartphone tambi&eacute;n compatible) <br />
                  2. Buena conexi&oacute;n de internet Wifi, o datos con buena se&ntilde;al. (En caso de ser posible, usar cable del router) <br />
                  3. Silencio y ambiente de concentraci&oacute;n para sacar el m&aacute;ximo provecho a tu videollamada. <br />&iexcl;Esperamos que la disfrutes!</p>
                <p>Tu exito, nuestro objetivo.</p>
              </p>
            </div>
          `
        })

        await this.mailsSerivce.sendMail({
          to: classSuccess.schedule.teacher.email,
          from: mailConfig.email,
          subject: 'Clase confirmada',
          text: 'Clase confirmada',
          html: `
              <div>
                <h2>&iexcl;Your class at AptisGo - B1B2Top has been confirmed!</h2>
                <p><strong>Your class will begin the ${timezone.teacher.startDate}.</strong></p>
                <p><strong>Topic ${indications.level} </strong> ${indications.about}</p>
                <p>
                  You will receive a notification (blue) in the Dashboard of the platform.
                  This notification will contain a button to access the call.
                  <br />
                  The class will automatically finish at the time set. 
                  <br />
                  In the case you have another class confirmed after this one, you will have 15 minutes break between them.
                </p>
                <p>
                  Remember to:
                  <br />
                  1. Check you are using a computer with a working camera and microphone.
                  <br />
                  2. Your internet connection is stable. (At least 4 MB download speed and 3 MB upload speed)
                  <br />
                  3. Check that you room is clean, silent, and with good lighting.
                </p>
                <p>Thanks for being part of the team.</p>
                <p>AptisGo - B1B2Top</p>
              </div>
            `
        })

        await this.mailsSerivce.sendMail({
          to: (this.configService.provider as unknown as { SES_REPLY_TO_EMAIL: string }).SES_REPLY_TO_EMAIL,
          from: mailConfig.email,
          subject: 'Clase confirmada',
          text: 'Clase confirmada',
          html: `
              <div>
                <h2>&iexcl;Your class at AptisGo - B1B2Top has been confirmed!</h2>
                <p><strong>Your class will begin the ${timezone.teacher.startDate}.</strong></p>
                <p><strong>Topic ${indications.level} </strong> ${indications.about}</p>
                <p>
                  You will receive a notification (blue) in the Dashboard of the platform.
                  This notification will contain a button to access the call.
                  <br />
                  The class will automatically finish at the time set. 
                  <br />
                  In the case you have another class confirmed after this one, you will have 15 minutes break between them.
                </p>
                <p>
                  Remember to:
                  <br />
                  1. Check you are using a computer with a working camera and microphone.
                  <br />
                  2. Your internet connection is stable. (At least 4 MB download speed and 3 MB upload speed)
                  <br />
                  3. Check that you room is clean, silent, and with good lighting.
                </p>
                <p>Thanks for being part of the team.</p>
                <p>AptisGo - B1B2Top</p>
              </div>
            `
        })

        return res.status(200).json({
          message: 'Class created succesfully',
          response: classInstance,
          statusCode: 200
        })
      }
      throw new NotFoundException(res.__('errors.Schedule Not Found'))
    }

    throw new NotFoundException(res.__('errors.Package Not Found'))
  }

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    this.logger.debug('user', user)

    if ((user as unknown as { role: { name: string } }).role.name === Roles.Teacher) {
      const classrooms = await this.classService.getAll({
        teacher: user.id,
        expired: false
      })

      this.logger.debug('classrooms', classrooms)

      return res.status(200).json({
        message: 'Classrooms fetched succesfully',
        response: classrooms,
        statusCode: 200
      })
    }

    const expired = req.originalUrl === this._historyEndpoint

    if (expired) {
      const { maxHistoryLength } = this.props

      const classrooms = await this.classService.getAll({
        user: user.id,
        expired: true,
        limit: maxHistoryLength
      })

      const classRoomTimezone = (classrooms as unknown[]).map(classroom => {
        return {
          ...(classroom as Record<string, unknown>),
          schedule: (ScheduleService.scheduleTimezoneConversion as unknown as (s: unknown, tz: unknown) => unknown)(
            (classroom as { schedule: unknown }).schedule,
            req.timezone
          )
        }
      })

      this.logger.debug('History:', classrooms)

      return res.status(200).json({
        message: 'Classrooms fetched succesfully',
        response: classRoomTimezone,
        statusCode: 200
      })
    }

    const classrooms = await this.classService.getAll({
      user: user.id,
      expired: false
    })

    const classRoomTimezone = (classrooms as unknown[]).map(classroom => {
      return {
        ...(classroom as Record<string, unknown>),
schedule: (ScheduleService.scheduleTimezoneConversion as unknown as (s: unknown, tz: unknown) => unknown)(
          (classroom as { schedule: unknown }).schedule,
          req.timezone
        )
      }
    })

    this.logger.debug('Confirmed:', classrooms)

    return res.status(200).json({
      message: 'Classrooms fetched succesfully',
      response: classRoomTimezone,
      statusCode: 200
    })
  }

  @Bind
  async getOne(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const classRoom = await this.classService.getOne({
      name: req.query.name as string
    }) as unknown as {
      schedule: {
        teacher: { id: number; firstName: string; email: string }
        anticipatedStartDate: string
        endDate: string
      }
      meetings: Array<{ user: { email: string } }>
    } | undefined

    if (classRoom) {
      if (req.query.info) {
        return res.json({
          response: classRoom.schedule.teacher,
          statusCode: 200
        })
      }

      const userInRoom = classRoom.meetings.find(
        meeting => meeting.user.email === user.email
      )

      const format = (this.configService.provider as unknown as { DATE_FORMAT: string }).DATE_FORMAT

      const isAvailable = moment()
        .utc()
        .isBetween(
          moment(classRoom.schedule.anticipatedStartDate).format(format),
          moment(classRoom.schedule.endDate).format(format)
        )

      this.logger.info('isAvailable', { status: isAvailable })

      const teacherInRoom = classRoom.schedule.teacher.id === user.id

      if (isAvailable) {
        if (userInRoom || teacherInRoom) {
          return res.status(200).json({
            message: 'Classroom obtained succesfully',
            response: classRoom,
            statusCode: 200
          })
        }
      } else {
        throw new ForbiddenException(
          res.__('errors.The class-meeting is no longer available')
        )
      }

      throw new NotFoundException(res.__('errors.Classroom Not Found'))
    }

    throw new NotFoundException(res.__('errors.Classroom Not Found'))
  }
}

export { ClassesController }
