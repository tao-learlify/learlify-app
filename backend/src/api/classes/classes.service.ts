import Classes from './classes.model'
import Package from 'api/packages/packages.model'
import Schedule from 'api/schedule/schedule.model'
import Meeting from 'api/meetings/meetings.model'
import { Bind } from 'decorators'
import type {
  RelationshipConfig,
  GetOneClassParams,
  GetAllClassParams,
  ClassTransactionResult,
  CreateClassInput
} from './classes.types'

const relationShip = Symbol('relationShip')

export class ClassesService {
  private readonly clientAttributes: string[]

  constructor() {
    (this as unknown as Record<symbol, RelationshipConfig>)[relationShip] = {
      getOne: {
        meetings: { $modify: ['withData'] },
        schedule: { $modify: ['withClass'] }
      },
      getAll: {
        graph: '[meetings, schedule.[teacher(withName)]]',
        foreignKeyUser: 'meetings.userId',
        foreignKeyTeacher: 'schedule.userId'
      },
      count: {
        graph: 'schedule',
        foreignKey: 'schedule.userId'
      }
    }
    this.clientAttributes = ['expired', 'name', 'id']
  }

  private get _rel(): RelationshipConfig {
    return (this as unknown as Record<symbol, RelationshipConfig>)[relationShip]
  }

  async create(classInstance: CreateClassInput): Promise<ClassTransactionResult> {
    const trx = await Classes.knex().transaction(async trx => {
      try {
        const pack = await Package.query(trx).patchAndFetchById(
          classInstance.package.id,
          { classes: classInstance.package.classes - 1 }
        )

        const schedule = await Schedule.query(trx)
          .patchAndFetchById(classInstance.schedule.id, { taken: true })
          .withGraphFetched({ teacher: { $modify: ['withName'] } })

        const room = await Classes.query(trx).insertAndFetch({
          scheduleId: classInstance.schedule.id,
          name: classInstance.name
        })

        const meeting = await Meeting.query(trx).insertAndFetch({
          classId: room.id,
          userId: classInstance.user.id,
          timezone: classInstance.timezone
        })

        return { room, package: pack, meeting, schedule }
      } catch (err) {
        return {
          error: true,
          stack: (err as Error).stack ?? String(err)
        }
      }
    })

    return trx as ClassTransactionResult
  }

  @Bind
  getOne(classInstance: GetOneClassParams) {
    const { getOne } = this._rel

    if (classInstance.id) {
      return Classes.query().findById(classInstance.id)
    }

    return Classes.query()
      .select(this.clientAttributes)
      .findOne(classInstance as Record<string, unknown>)
      .withGraphFetched(getOne)
  }

  @Bind
  getAll({ user, teacher, expired, limit, ...props }: GetAllClassParams) {
    const { getAll, count } = this._rel

    if (props.count) {
      return Classes.query()
        .withGraphJoined(count.graph)
        .where('classes.expired', true)
        .andWhere(count.foreignKey, props.options!.teacherId)
    }

    if (limit) {
      return Classes.query()
        .withGraphJoined(getAll.graph)
        .where({ expired })
        .limit(limit)
        .andWhere(getAll.foreignKeyUser, user!)
        .orderBy('createdAt', 'DESC')
    }

    return user
      ? Classes.query()
          .withGraphJoined(getAll.graph)
          .where({ expired })
          .andWhere(getAll.foreignKeyUser, user!)
      : Classes.query()
          .withGraphJoined(getAll.graph)
          .where({ expired })
          .andWhere(getAll.foreignKeyTeacher, teacher!)
  }
}
