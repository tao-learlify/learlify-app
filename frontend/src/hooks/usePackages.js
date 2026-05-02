import { useEffect, useCallback } from 'react'
import { initialArguments } from 'hooks'
import { useDispatch, useSelector } from 'react-redux'
import { packagesSelector } from 'store/@selectors/packages'
import { createPackageThunk, fetchPackagesThunk } from 'store/@thunks/packages'

/**
 * @typedef {Object} UsePackagesHook
 * @property {boolean} loading
 * @property {[]} packages
 */

/**
 * @param {useBackendService}
 * @returns {UsePackagesHook}
 */
function usePackages({ preload } = initialArguments) {
  const dispatch = useDispatch()

  const packages = useSelector(packagesSelector)

  const fetchPackages = useCallback(() => {
    const stream = dispatch(fetchPackagesThunk())

    return () => {
      stream.abort()
    }
  }, [dispatch])

  useEffect(() => {
    if (preload) {
      const stream = dispatch(fetchPackagesThunk())

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, preload])

  const createPackageIntent = useCallback(
    /**
     * @param {{}} data
     */
    data => dispatch(createPackageThunk(data)),
    [dispatch]
  )

  return {
    ...packages,
    createPackageIntent,
    fetchPackages
  }
}

export default usePackages
