import React, { memo } from 'react'

import Icon from 'react-icons-kit'
import { bars } from 'react-icons-kit/fa/bars'


import styles from '../styles.module.scss'

/**
 * @typedef {Object} MainProps
 * @property {() => void} onToggleContext
 */

/**
 * @type {React.FunctionComponent<MainProps>}
 */
const Main = ({ onToggleContext, children }) => {
  return (
    <main className={styles.container}>
      <div about="menu" onClick={onToggleContext}>
        <Icon icon={bars} />
      </div>
      <header>{children}</header>
    </main>
  )
}

Main.defaultProps = {
  onToggleContext: () => null
}

export default memo(Main)
