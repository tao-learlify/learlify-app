import { useEffect } from 'react'

/**
 * @description
 * After boolean values converts to true, or truthy values, will runs an effect.
 * @param {Function} callback 
 * @param {any} nullableValue 
 */
function useUpdate(callback, nullableValue) {
  useEffect(() => {
    if (Boolean(nullableValue)) {
      callback()
    }
  }, [callback, nullableValue])
}

export default useUpdate