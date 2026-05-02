import { Injectable, Bind } from 'decorators'
import { Logger } from 'api/logger'
import Schedule from './schedule.model'
import Classes from 'api/classes/classes.model'
import Meetings from 'api/meetings/meetings.model'
import moment from 'moment-timezone'

type DateFilter = {
  now?: string
  notExpired?: boolean
  expire?: string
  startDate?: string
  endDate?: string
}

type Source = {
  id?: unknown
  startDate?: unknown
  endDate?: unknown
  langId?: unknown
  userId?: unknown
  optionId?: unknown
  date?: DateFilter
  notified?: unknown
  taken?: unknown
  streaming?: unknown
  [key: string]: unknown
}

type ScheduleProperties = {
  clientAttributes: string[]
  endDate: string
  startDate: string
  anticipatedStartDate: string
}

type RelationShipConfig = {
  create: unknown
  getAll: unknown
  getAllExpiration: unknown
}

type LooseQueryBuilder = {
  insertAndFetch(value: unknown): LooseQueryBuilder
  withGraphFetched(graph: unknown): LooseQueryBuilder
  select(columns: string[]): LooseQueryBuilder
  where(...args: unknown[]): LooseQueryBuilder
  orWhere(...args: unknown[]): LooseQueryBuilder
  andWhere(...args: unknown[]): LooseQueryBuilder
  skipUndefined(): LooseQueryBuilder
  findOne(value: unknown): LooseQueryBuilder
  patchAndFetchById(id: unknown, value: unknown): LooseQueryBuilder
  patchAndFetch(value: unknown): LooseQueryBuilder
  deleteById(id: unknown): LooseQueryBuilder
  delete(): LooseQueryBuilder
}

type LooseModel = {
  query(trx?: unknown): LooseQueryBuilder
  knex(): {
    transaction<T>(callback: (trx: unknown) => Promise<T>): Promise<T>
  }
}

const relationShip = Symbol('relationShip')

const ScheduleModel = Schedule as unknown as LooseModel
const ClassesModel = Classes as unknown as Pick<LooseModel, 'query'>
const MeetingsModel = Meetings as unknown as Pick<LooseModel, 'query'>

@Injectable
class ScheduleService {
  props: ScheduleProperties
  logger: typeof Logger.Service
  [relationShip]: RelationShipConfig

  constructor() {
    this.props = {
      clientAttributes: [
        'id',
        'startDate',
        'endDate',
        'taken',
        'notified',
        'notes',
        'streaming'
      ],
      endDate: 'endDate',
      startDate: 'startDate',
      anticipatedStartDate: 'anticipatedStartDate'
    }
    this[relationShip] = {
      create: {
        teacher: {
          $modify: ['withName']
        }
      },
      getAll: {
        language: true,
        classes: {
          $modify: ['withClassName'],
          meetings: {
            $modify: ['withData']
          }
        },
        teacher: {
          $modify: ['withName']
        }
      },
      getAllExpiration: {
        language: true,
        classes: {
          $modify: ['activeWithNoExpiration'],
          meetings: {
            $modify: ['withData']
          }
        },
        teacher: {
          $modify: ['withName']
        }
      }
    }
    this.logger = Logger.Service
  }

  static scheduleTimezoneConversion<
    T extends { startDate: string; endDate: string }
  >(schedule: T, timezone: string): T {
    const logger = Logger.Service
    const format = 'YYYY-MM-DD HH:mm:ss'

    if (schedule) {
      const output = {
        ...schedule,
        startDate: moment(schedule.startDate)
          .tz(timezone, false)
          .format(format),
        endDate: moment(schedule.endDate).tz(timezone, false).format(format)
      }

      logger.debug('Timezone', {
        startDate: moment(schedule.startDate).tz(timezone, false).format(),
        endDate: moment(schedule.endDate).tz(timezone, false).format()
      })

      return output as T
    }

    return schedule
  }

  create(options: Source): unknown {
    const { create } = this[relationShip]

    return ScheduleModel.query()
      .insertAndFetch(options)
      .withGraphFetched(create)
  }

  exist(id: unknown): unknown {
    return ScheduleModel.query().select(['id']).where({ id })
  }

  remove(id: unknown): unknown {
    return ScheduleModel.query().deleteById(id)
  }

  @Bind
  getAll({ date, ...options }: Source): unknown {
    const {
      clientAttributes,
      anticipatedStartDate,
      endDate,
      startDate
    } = this.props

    const { getAll } = this[relationShip]

    if (date) {
      const whereOptions: Record<string, unknown> = {}

      if ('userId' in options) {
        whereOptions.userId = options.userId
      }

      if ('langId' in options) {
        whereOptions.langId = options.langId
      }

      if ('notified' in options) {
        whereOptions.notified = options.notified
      }

      if ('taken' in options) {
        whereOptions.taken = options.taken
      }

      if (date.now) {
        this.logger.info(`Schedule by now: ${date.now}`, { data: true })
        return date.notExpired
          ? ScheduleModel.query()
              .where(anticipatedStartDate, '<=', date.now)
              .orWhere(startDate, '<=', date.now)
              .andWhere(endDate, '>', date.now)
              .andWhere(whereOptions)
              .withGraphFetched(getAll)
              .select(clientAttributes)
              .skipUndefined()
          : ScheduleModel.query()
              .where(anticipatedStartDate, '<=', date.now)
              .orWhere(startDate, '<=', date.now)
              .andWhere(endDate, '>', date.now)
              .andWhere(whereOptions)
              .select(clientAttributes)
              .withGraphFetched(getAll)
              .skipUndefined()
      }

      if (date.expire) {
        this.logger.info(`Schedule by expire: ${date.expire}`)

        return ScheduleModel.query()
          .where(endDate, '<=', date.expire)
          .andWhere({ streaming: true })
          .withGraphFetched(getAll)
      }

      return options
        ? ScheduleModel.query()
            .where(startDate, '>', date.startDate)
            .andWhere(endDate, '<', date.endDate)
            .andWhere(whereOptions)
            .select(clientAttributes)
            .withGraphFetched(getAll)
            .skipUndefined()
        : ScheduleModel.query()
            .where(startDate, '>', date.startDate)
            .andWhere(endDate, '<', date.endDate)
            .select(clientAttributes)
            .withGraphFetched(getAll)
            .skipUndefined()
    }

    return ScheduleModel.query()
      .withGraphFetched(getAll)
      .where(options)
      .select(clientAttributes)
  }

  @Bind
  getOne(schedule: Source): unknown {
    const { getAll } = this[relationShip]

    return ScheduleModel.query().findOne(schedule).withGraphFetched(getAll).skipUndefined()
  }

  updateOne(schedule: Source): unknown {
    if (schedule.id) {
      return ScheduleModel.query().patchAndFetchById(schedule.id, {
        ...schedule
      })
    }

    return ScheduleModel.query().patchAndFetch(schedule)
  }

  @Bind
  deleteBy({ expire, ...options }: Source & { expire?: string }): unknown {
    const { endDate } = this.props

    if (expire) {
      return ScheduleModel.query()
        .delete()
        .where(endDate, '<', expire)
        .andWhere(options)
    }

    return undefined
  }

  async expireClassRoomAndUpdate(source: { id: unknown }): Promise<unknown> {
    const transaction = await ScheduleModel.knex().transaction(async trx => {
      try {
        const schedule = (await ScheduleModel.query(trx)
          .patchAndFetchById(source.id, {
            streaming: false
          })
          .withGraphFetched({ classes: true })) as {
          classes?: {
            id: unknown
          }
          [key: string]: unknown
        }

        this.logger.debug('expire', schedule)

        if (schedule.classes) {
          const classroom = await ClassesModel.query(trx).patchAndFetchById(
            schedule.classes.id,
            {
              expired: true
            }
          )

          return {
            classroom,
            schedule
          }
        }

        return {
          schedule
        }
      } catch (err: unknown) {
        this.logger.error('expireClassRoomTransaction', err)

        throw new Error(err as string)
      }
    })

    return transaction
  }

  @Bind
  async getStream(user: unknown): Promise<unknown> {
    return MeetingsModel.query()
      .withGraphFetched({
        classes: {
          schedule: {
            $modify: ['stream']
          }
        }
      })
      .where({ userId: user })
  }
}

export { ScheduleService }
