import React, { useEffect, useState } from 'react'
import { StageSpinner } from 'react-spinners-kit'

/**
 * @typedef {Object} AsyncComponentProps
 * @property {string} resource
 * @property {string} innerNodeClassName
 */

const XHR = {
  once: true
}

/**
 * @type {React.FunctionComponent<AsyncComponentProps>}
 */
const AsyncComponent = ({ resource, innerNodeClassName, children }) => {
  const [state, setState] = useState({
    loading: true,
    render: false,
    fail: false
  })

  useEffect(() => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', resource, true)

    xhr.send()

    xhr.addEventListener(
      'load',
      () => {
        if (xhr.status === 200) {
          setState({
            render: true,
            status: xhr.status
          })
        } else {
          setState({
            fail: true
          })
        }
      },
      XHR
    )

    return () => {
      xhr.abort()
    }
  }, [resource])

  return (
    <React.Fragment>
      {state.loading &&
        (innerNodeClassName ? (
          <div className={innerNodeClassName}>
            <StageSpinner />
          </div>
        ) : (
          <StageSpinner />
        ))}
      {state.render && children}
    </React.Fragment>
  )
}

export default AsyncComponent
