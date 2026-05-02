import Advance from './advance.model'
import type { AdvanceSource, AdvanceCreateInput, AdvanceUpdateInput } from './advance.types'

export class AdvanceService {
  create(advance: AdvanceCreateInput) {
    return Advance.query().insertAndFetch(advance)
  }

  getOne(advance: AdvanceSource) {
    return Advance.query().findOne(advance)
  }

  updateOne({ id, ...advance }: AdvanceUpdateInput) {
    return Advance.query().patchAndFetchById(id, advance)
  }
}
