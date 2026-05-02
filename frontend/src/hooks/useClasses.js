import { useSelector } from 'react-redux'

import { classesSelector } from 'store/@selectors/classes'

/**
 * @typedef {Object} ClassesHook
 * @property {[]} classRooms
 * @property {boolean} loading
 */

/**
 * @returns {ClassesHook}
 */
function useClasses() {
  const classes = useSelector(classesSelector)

  return classes
}

export default useClasses
