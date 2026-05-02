import React, { memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'

import Emoji from './Emoji'
import Text from './Text'
import Dropdown from './Dropdown'
import DropdownItem from './DropdownItem'

const PickerContainer = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
`

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
      <Row>
        <Col md={8} lg={8} xs={12} sm={12}>
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
        </Col>
        <Col md={4} lg={4} xs={12} sm={12}>
          <Emoji name={emoji} />
        </Col>
      </Row>
      <Row>
        <Col md={6} lg={7} xs={12} sm={12}>
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
        </Col>
      </Row>
    </>
  )
)

Picker.defaultProps = {
  data: [],
  JSXRenderingKey: 'id',
  dropdownTextInfo: false
}

export default memo(Picker)
