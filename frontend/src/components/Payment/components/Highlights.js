import React from 'react'
import Text from 'components/Text'

import styles from '../payment.module.scss'
import { getPackagePrice } from 'utils/functions'
/**
 * @typedef {Plan} HighlightProps
 */

/**
 * @type {React.FunctionComponent<HighlightProps>}
 */
const Highlights = ({ plan }) => {
  return (
    <>
      <div className={styles.details}>
        <Text tag="small" color="muted">
          Paquete: {plan.name}
        </Text>
        <div className={styles.margin} />
        <Text tag="small" color="muted">
          Precio: {getPackagePrice(plan.taxe ? plan.taxe : plan.price)}
        </Text>
      </div>
      <div className={styles.details}>
        <Text tag="small" color="muted">
          Speakings: {plan.speaking}
        </Text>
        <div className={styles.margin} />
        <Text tag="small" color="muted">
          Writings: {plan.writing}
        </Text>
      </div>
      <hr />
      <div className={styles.details}>
        <Text tag="small" color="muted">
          Clases Online: {plan.classes}
        </Text>
        <div className={styles.margin} />
        <Text tag="small" color="muted">
          Duración: 1 mes
        </Text>
      </div>
    </>
  )
}

export default Highlights
