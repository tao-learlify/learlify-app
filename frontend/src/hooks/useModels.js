import { useSelector } from 'react-redux'
import { modelSelector} from 'store/@selectors/models'



/**
 * @typedef {Object} CurrentModelHook
 * @property {{ APTIS: string, IELTS: string }} ofType
 * @property {string} model
 */

/**
 * @returns {CurrentModelHook}
 */
function useModels() {
  const data = useSelector(modelSelector)

  return {
    model: data.models.selected,
    data: data.models.data,
    loading: data.models.loading
  }
}

export default useModels