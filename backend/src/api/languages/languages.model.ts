import { Model, JSONSchema, RelationMappings } from 'objection'
import Schedule from 'api/schedule/schedule.model'

class Language extends Model {
  id!: number
  lang!: string

  static get tableName(): string {
    return 'languages'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        lang: { type: 'string' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      schedules: {
        relation: Model.HasManyRelation,
        modelClass: Schedule as unknown as typeof Model,
        join: {
          from: 'languages.id',
          to: 'schedule.langId'
        }
      }
    }
  }
}

export default Language
