import Language from './languages.model'

export class LanguageService {
  getAll() {
    return Language.query()
  }

  getOne(options: Record<string, unknown>) {
    return Language.query().findOne(options)
  }
}
