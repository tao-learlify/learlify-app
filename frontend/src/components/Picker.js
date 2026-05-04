import React, { memo } from 'react'
import clsx from 'clsx'

import Emoji from './Emoji'
import Text from './Text'
import Dropdown from './Dropdown'
import DropdownItem from './DropdownItem'

function PickerContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-4 tw:pb-4', className)} {...rest}>{children}</div>
}

/**
 * @typedef {Object} PickerProps
 * @property {[]} data
 * @property {string} description
 * @property {string | []} subheader
 * @property {string} title
 * @property {string} JSXRenderingKey
 * @property {string} JSXRenderingItem
 * @property {() => {}} onChange
 * @property {string} emoji
 * @property {{}} pick
 * @property {string} dropdownTextInfo
 */

/**
 * @type {React.FunctionComponent<PickerProps>}
 */
const Picker = memo(
  ({
    data,
    description,
    dropdownTextInfo,
    emoji,
    JSXRenderingItem,
    JSXRenderingKey,
    onChange,
    pick,
    subheader,
    title
  }) => (
    <>
      <PickerContainer>
        <Text center bold color="dark" tag="h2">
          {title}
        </Text>
      </PickerContainer>
      <div className="tw:flex tw:flex-wrap tw:mb-4">
        <div className="tw:w-full md:tw:w-8/12 tw:px-4">
          <Text bold color="dark" tag="h4">
            {description}
          </Text>
          {typeof subheader === 'object' ? (
            subheader.map(item => (
              <Text key={item} color="muted" tag="p">
                {item}
              </Text>
            ))
          ) : (
            <Text color="muted" tag="p">
              {subheader}
            </Text>
          )}
        </div>
        <div className="tw:w-full md:tw:w-4/12 tw:px-4">
          <Emoji name={emoji} />
        </div>
      </div>
      <div className="tw:flex tw:flex-wrap">
        <div className="tw:w-full md:tw:w-7/12 tw:px-4">
          {dropdownTextInfo && (
            <div className="mb-1 pb-1">
              <Text tag="small" color="muted">
                {dropdownTextInfo}
              </Text>
            </div>
          )}
          <Dropdown id="picker" name={pick}>
            {data.map(value => (
              <DropdownItem
                key={value[JSXRenderingKey]}
                value={value[`${JSXRenderingItem}`]}
                onClick={() => onChange({ ...value })}
              />
            ))}
          </Dropdown>
        </div>
      </div>
    </>
  )
)

Picker.defaultProps = {
  data: [],
  JSXRenderingKey: 'id',
  dropdownTextInfo: false
}

export default memo(Picker)
