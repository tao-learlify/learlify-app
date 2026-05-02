import { useLocation } from 'react-router-dom'

function useLocationState () {
  const location = useLocation()

  return location.state
}

export default useLocationState