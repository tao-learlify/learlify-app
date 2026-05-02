import React from 'react'
import classNames from 'clsx'
import { Table } from 'react-bootstrap'


import Text from './Text'
import 'assets/css/tables.scss' 
import 'assets/css/dropdown.css'

/**
 * @typedef {Object} ManagementProps
 * @property {string} className
 * @property {TextColor} color
 * @property {boolean} alternative
 * @property {string []} rows
 * @property {boolean} border
 * @property {boolean} bold
 * @property {boolean} striped
 */

/**
 * @type {React.FunctionComponent<ManagementProps>}
 */
const Management = ({
  className,
  alternative,
  rows,
  border,
  bold,
  striped,
  children,
  color,
  size
}) => {
  return (
    <Table
      striped={striped}
      size={size}
      className={classNames(
        border && 'border rounded',
        className && className
      )}
    >
      <thead className="text-center">
        <tr>
          {rows.map(row => (
            <th key={row}>
              <Text tag="small" color={color}>
                {row}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

Management.defaultProps = {
  rows: [],
  border: true,
  bold: false,
  color: 'white',
  alternative: false,
  size: 'sm'
}

export default React.memo(Management)
