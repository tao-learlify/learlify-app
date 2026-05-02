import { Model } from 'objection'
import type { JSONSchema, RelationMappings, ModelClass, Modifiers, QueryBuilder } from 'objection'

import User from 'api/users/users.model'
import Exam from 'api/exams/exams.model'

class Progress extends Model {
  id!: number
  examId?: number
  userId?: number
  data?: Record<string, unknown>

  static get tableName(): string {
    return 'progress'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      required: [],
      type: 'object',
      properties: {
        id: { type: 'integer' },
        examId: { type: 'integer' },
        userId: { type: 'integer' },
        data: { type: 'object' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      exam: {
        relation: Model.HasOneRelation,
        modelClass: Exam as unknown as ModelClass<Model>,
        join: {
          from: 'progress.examId',
          to: 'exams.id'
        }
      },

      user: {
        relation: Model.HasOneRelation,
        modelClass: User as unknown as ModelClass<Model>,
        join: {
          from: 'progress.userId',
          to: 'users.id'
        }
      }
    }
  }

  static get modifiers(): Modifiers {
    return {
      exam(builder: QueryBuilder<Model>) {
        return builder.select(['data'])
      }
    }
  }
}

export default Progress
