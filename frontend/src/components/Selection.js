import React, { memo, useCallback } from 'react'
import classNames from 'clsx'
import Icon from 'react-icons-kit'
import { ic_expand_more } from 'react-icons-kit/md/ic_expand_more'
import 'assets/css/reading.css'

const defaultStyle = {
  position: 'relative',
  left: -22
}

const defaultClass = 'select-css text-muted'
/**
 * @type {React.FunctionComponent<import('react').HTMLAttributes<HTMLSelectElement>>}
 */
const Selection = (props) => {

  const { options, key, selection } = props

  const checkStore = useCallback(
    option => {
      const storage = selection.reduce(
        (prev, next) => prev.concat(next[key] || next),
        []
      )

      return storage.includes(option)
    },
    [key, selection]
  )

  return (
    <React.Fragment>
      <select className={classNames(defaultClass, classNames && classNames)} {...props}>
        {options.map(option => (
          <option
            disabled={checkStore(option[key] || option)}
            key={option[key] || option}
            value={option[key] || option}
          >
            {option[key] || option}
          </option>
        ))}
      </select>
      <Icon style={defaultStyle}  icon={ic_expand_more} />
    </React.Fragment>
  )
}

Selection.defaultProps = {
  options: [],
  key: 'default',
  className: ''
}

export default memo(Selection)
