import { Model, JSONSchema, RelationMappings, ModelClass } from 'objection'
import Course from 'api/courses/courses.model'

class View extends Model {
  id!: number
  url!: string
  courseId!: number

  static get idColumn(): string {
    return 'id'
  }

  static get tableName(): string {
    return 'views'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['url', 'courseId'],
      properties: {
        id: { type: 'integer' },
        url: { type: 'string' },
        courseId: { type: 'integer' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      courses: {
        relation: Model.HasOneRelation,
        modelClass: Course as unknown as ModelClass<Model>,
        join: {
          from: 'views.courseId',
          to: 'courses.id'
        }
      }
    }
  }

  static get modifiers() {
    return {
      token(sql: { select(cols: string[]): void }) {
        sql.select(['url', 'createdAt'])
      }
    }
  }
}

export default View
