import { Model, type JSONSchema, type Modifiers, type RelationMappings, type QueryBuilder } from 'objection'
import Classes from 'api/classes/classes.model'
import Language from 'api/languages/languages.model'
import User from 'api/users/users.model'

class Schedule extends Model {
  id!: number
  langId!: number
  userId!: number
  modelId!: number
  anticipatedStartDate!: string
  startDate!: string
  endDate!: string
  taken?: boolean
  notified?: boolean
  notes?: string
  streaming?: boolean
  classes?: {
    id: number
  }
  teacher?: {
    email: string
    firstName: string
    lastName: string
  }

  static get tableName(): string {
    return 'schedule'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      required: ['langId', 'userId', 'modelId'],

      properties: {
        id: { type: 'integer' },
        langId: { type: 'integer' },
        userId: { type: 'integer' },
        modelId: { type: 'integer' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      classes: {
        relation: Model.HasOneRelation,
        modelClass: Classes,
        join: {
          from: 'schedule.id',
          to: 'classes.scheduleId'
        }
      },

      language: {
        relation: Model.HasOneRelation,
        modelClass: Language,
        join: {
          from: 'schedule.langId',
          to: 'languages.id'
        }
      },

      teacher: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'schedule.userId',
          to: 'users.id'
        }
      }
    }
  }

  static get modifiers(): Modifiers {
    return {
      withClass(builder: QueryBuilder<Schedule, Schedule[]>) {
        return builder
          .select([
            'id',
            'anticipatedStartDate',
            'startDate',
            'endDate',
            'notes',
            'taken',
            'notified',
            'streaming'
          ])
          .withGraphFetched({
            language: true,
            teacher: {
              $modify: ['withName']
            }
          })
      },

      withName(builder: QueryBuilder<Schedule, Schedule[]>) {
        return builder.select(['email', 'firstName', 'lastName'])
      },

      activeFields(builder: QueryBuilder<Schedule, Schedule[]>) {
        return builder.select(['id', 'taken', 'notified', 'streaming'])
      },

      stream(builder: QueryBuilder<Schedule, Schedule[]>) {
        return builder.where({ streaming: true })
      }
    }
  }
}

export default Schedule
