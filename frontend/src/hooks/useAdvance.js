import { useSelector } from 'react-redux'

import { advanceSelector } from 'store/@selectors/courses'

function useAdvance () {
  const advance = useSelector(advanceSelector)

  return advance
}

export default useAdvance