import { Model } from 'objection'
import type {
  JSONSchema,
  RelationMappings,
  ModelClass,
  Modifiers,
  QueryBuilder
} from 'objection'
import Gift from 'api/gifts/gifts.model'
import Access from 'api/access/access.model'
import Models from 'api/models/models.model'
type PlanPriceModel = import('api/plan-prices/plan-prices.model').default

class Plan extends Model {
  id!: number
  available?: boolean
  name?: string
  code?: string | null
  classes?: number
  description?: string
  currency?: string
  writing?: number
  speaking?: number
  price?: number
  feature?: string
  includes_course?: boolean
  included_exams?: number | null
  included_speaking_reviews?: number
  included_writing_reviews?: number
  sort_order?: number
  modelId?: number
  model?: Record<string, unknown>
  createdAt?: string
  updatedAt?: string

  static get tableName(): string {
    return 'plans'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        available: { type: 'boolean' },
        name: { type: 'string' },
        code: { type: ['string', 'null'] },
        classes: { type: 'integer' },
        description: { type: 'string', maxLength: 512 },
        currency: { type: 'string', maxLength: 3 },
        writing: { type: 'integer' },
        speaking: { type: 'integer' },
        price: { type: 'integer' },
        feature: { type: 'string', enum: ['COURSES', 'CLASSES', 'EXAMS'] },
        includes_course: { type: 'boolean' },
        included_exams: { type: ['integer', 'null'] },
        included_speaking_reviews: { type: 'integer' },
        included_writing_reviews: { type: 'integer' },
        sort_order: { type: 'integer' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      gifts: {
        modelClass: (Gift as unknown) as ModelClass<Model>,
        relation: Model.HasOneRelation,
        join: {
          from: 'plans.id',
          to: 'gifts.planId'
        }
      },
      access: {
        modelClass: (Access as unknown) as ModelClass<Model>,
        relation: Model.HasManyRelation,
        join: {
          from: 'plans.id',
          to: 'access.planId'
        }
      },
      model: {
        modelClass: (Models as unknown) as ModelClass<Model>,
        relation: Model.HasOneRelation,
        join: {
          from: 'plans.modelId',
          to: 'exam_models.id'
        }
      },
      prices: {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        modelClass: (require('api/plan-prices/plan-prices.model')
          .default as unknown) as ModelClass<Model & PlanPriceModel>,
        relation: Model.HasManyRelation,
        join: {
          from: 'plans.id',
          to: 'plan_prices.plan_id'
        }
      }
    }
  }

  static get modifiers(): Modifiers {
    return {
      name(builder: QueryBuilder<Model>) {
        builder.select(['name'])
      }
    }
  }
}

export default Plan
