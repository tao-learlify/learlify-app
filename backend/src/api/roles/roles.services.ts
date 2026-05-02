import Role from './roles.model'

export interface RoleRecord {
  id: number
  name: string
}

export class RolesService {
  private clientAttributes: string[]

  constructor() {
    this.clientAttributes = ['name']
  }

  findOne({ id, name }: { id?: number; name?: string }): Promise<RoleRecord> {
    if (id) {
      return Role.query().findById(id) as unknown as Promise<RoleRecord>
    }
    return Role.query().findOne({ name }) as unknown as Promise<RoleRecord>
  }

  getAll() {
    const attributes = this.clientAttributes
    return Role.query().select(attributes)
  }
}
