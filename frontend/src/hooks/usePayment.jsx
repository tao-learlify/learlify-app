import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { isEmpty } from 'utils/functions'

/**
 *
 * @param {function} callback
 * @param {[]} packages
 */
function usePayment() {
  const [loading, setLoading] = useState(false)

  const [packagesData, setPackageData] = useState([])

  const auth = useSelector(state => state.auth, shallowEqual)

  const packages = useSelector(state => state.resources.packages, shallowEqual)

  const payment = useSelector(state => state.payments.payment, shallowEqual)

  const dispatch = useDispatch()

  const fetchPackages = useCallback(
    data => {
      dispatch({ type: 'SOMETHING' })
    },
    [dispatch]
  )

  useEffect(() => {
    fetchPackages({
      userId: auth.userProfile.id
    })
  }, [fetchPackages, auth.userProfile])

  
  useEffect(() => {
    fetchPackages({
      userId: auth.userProfile.id
    })
  }, [auth.userProfile.id, fetchPackages, payment])

  useEffect(() => {
    if (!isEmpty(packages)) {
      setPackageData(packages)

      setLoading(false)
    }
  }, [packages])

  return [loading, packagesData]
}

export default usePayment
