import React from 'react'
import Text from './Text'

/**
 * @typedef {Object} TableHeaderProps
 * @property {string} value
 * @property {string} hexColor
 */

/**
 * @type {React.FunctionComponent<TableHeaderProps>}
 */
const TableHeader = ({ value, color, children, hexColor, ...props }) => {


  return children ? (
    <th className="text-center" {...props}>
      {children}
    </th>
  ) : (
    <th className="text-center" {...props}>
      <Text lighter tag="small" color={color}>{value}</Text>
    </th>
  )
}

export default TableHeader
