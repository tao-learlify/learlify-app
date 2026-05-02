import { useCallback } from 'react'
import { APTIS_KEY } from 'utils/localStorage'

/**
 * @typedef {Object} useLocalStorage
 * @property {string} key
 * @property {boolean} transform
 */

/**
 *
 * @param {useLocalStorage} params
 * @returns {{ item?: string | {}, setItem: () => void, removeItem: () => void }}
 */
export default function useLocalStorage(
  { key, transform } = { key: APTIS_KEY, transform: false }
) {
  const item = localStorage.getItem(key || '')

  const setItem = useCallback(
    (localStorageItemValues, stringify) => {
      localStorage.setItem(
        key || '',
        stringify
          ? JSON.stringify(localStorageItemValues)
          : localStorageItemValues
      )
    },
    [key]
  )

  const removeItem = useCallback(() => {
    localStorage.removeItem(key || '')
  }, [key])

  return {
    item: transform && item ? JSON.parse(item) : item,
    removeItem,
    setItem
  }
}
