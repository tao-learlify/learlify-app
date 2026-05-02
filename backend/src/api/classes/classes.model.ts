import { Model, JSONSchema, RelationMappings, Modifiers, QueryBuilder } from 'objection'
import Schedule from 'api/schedule/schedule.model'
import Meeting from 'api/meetings/meetings.model'

class Classes extends Model {
  id!: number
  scheduleId!: number
  name!: string
  expired!: boolean

  static get tableName(): string {
    return 'classes'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        scheduleId: { type: 'integer' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      schedule: {
        relation: Model.HasOneRelation,
        modelClass: Schedule,
        join: {
          from: 'classes.scheduleId',
          to: 'schedule.id'
        }
      },
      meetings: {
        relation: Model.HasManyRelation,
        modelClass: Meeting,
        join: {
          from: 'classes.id',
          to: 'meetings.classId'
        }
      }
    }
  }

  static get modifiers(): Modifiers {
    return {
      withClassName(builder: QueryBuilder<Classes>) {
        builder.select(['id', 'name', 'expired'])
      },
      active(builder: QueryBuilder<Classes>) {
        builder.select(['id', 'name', 'expired'])
      },
      activeWithNoExpiration(builder: QueryBuilder<Classes>) {
        builder.select(['name', 'expired'])
      }
    }
  }
}

export default Classes
