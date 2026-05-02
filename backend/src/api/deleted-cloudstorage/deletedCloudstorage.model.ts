import { Model, JSONSchema } from 'objection'

class DeletedCloudStorage extends Model {
  id!: number
  bucket!: string
  location!: string
  ETag!: string
  key!: string
  userId!: number

  static get tableName(): string {
    return 'deleted_cloudstorage'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        bucket: { type: 'string' },
        location: { type: 'string' },
        ETag: { type: 'string' },
        key: { type: 'string' },
        userId: { type: 'integer' }
      }
    }
  }
}

export default DeletedCloudStorage
