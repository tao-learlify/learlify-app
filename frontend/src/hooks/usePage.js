import { useState } from 'react'

const INITIAL_PAGE = 1

function usePage () {
  const [page, setPage] = useState(INITIAL_PAGE)


  const handleSet = page => {
    setPage(page)
  }

  return {
    page,
    handleSet
  }
}

export default usePage