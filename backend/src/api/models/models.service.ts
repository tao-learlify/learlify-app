import Models from './models.model'

class ModelsService {
  getAll() {
    return Models.query()
  }

  getOne(data: Record<string, unknown>) {
    return Models.query().findOne(data)
  }
}

export { ModelsService }
