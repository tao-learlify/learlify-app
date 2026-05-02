import React, { useEffect } from 'react'

import useAuthProvider from 'hooks/useAuthProvider'



const Logout = () => {
  const { logOut: logOutCallback } = useAuthProvider()

  useEffect(logOutCallback, [logOutCallback])

  return <React.Fragment />
}

export default Logout