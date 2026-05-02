import { Model } from 'objection'
import type { JSONSchema, RelationMappings, ModelClass } from 'objection'

import User from 'api/users/users.model'
import Course from 'api/courses/courses.model'

class Advance extends Model {
  id!: number
  userId!: number
  courseId!: number
  content!: Record<string, unknown>

  static get tableName(): string {
    return 'advance'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      required: ['userId', 'courseId'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        courseId: { type: 'integer' },
        content: { type: 'object' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      users: {
        modelClass: User as unknown as ModelClass<Model>,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'advance.userId',
          to: 'users.id'
        }
      },

      courses: {
        modelClass: Course as unknown as ModelClass<Model>,
        relation: Model.HasManyRelation,
        join: {
          from: 'advance.courseId',
          to: 'courses.id'
        }
      }
    }
  }
}

export default Advance
