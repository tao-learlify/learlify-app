import { Model, JSONSchema, RelationMappings, ModelClass } from 'objection'
import Course from 'api/courses/courses.model'
import Plan from 'api/plans/plans.model'
import User from 'api/users/users.model'

class Models extends Model {
  id!: number
  name!: string

  static get tableName(): string {
    return 'exam_models'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      }
    }
  }

  static get modifiers() {
    return {
      clientAttributes(builder: { select(cols: string[]): void }) {
        builder.select(['*'])
      },
      token(builder: { select(cols: string[]): void }) {
        builder.select(['id', 'name'])
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      users: {
        modelClass: User,
        relation: Model.HasManyRelation,
        join: {
          from: 'exams_models.id',
          to: 'users.id'
        }
      },
      plans: {
        modelClass: Plan as unknown as ModelClass<Model>,
        relation: Model.HasManyRelation,
        join: {
          from: 'exams_models.id',
          to: 'plans.modelId'
        }
      },
      courses: {
        modelClass: Course as unknown as ModelClass<Model>,
        relation: Model.HasManyRelation,
        join: {
          from: 'exams_models.id',
          to: 'courses.modelId'
        }
      }
    }
  }
}

export default Models
