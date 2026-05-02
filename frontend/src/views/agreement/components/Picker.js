import React, { memo } from 'react'
import {
  TitleContainer,
  DescriptionTitle,
  DescriptionText,
  EmojiContainer
} from './styles'

import Emoji from 'components/Emoji'
import Text from 'components/Text'
import Dropdown from 'components/Dropdown'
import DropdownItem from 'components/DropdownItem'

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
      <TitleContainer>
        {title}
      </TitleContainer>     
      <DescriptionTitle>
        {description}
      </DescriptionTitle>
      {typeof subheader === 'object' ? (
        subheader.map(item => (
          <DescriptionText key={item}>
            {item}
          </DescriptionText>
        ))
      ) : (
        <DescriptionText>
          {subheader}
        </DescriptionText>
      )}
      <EmojiContainer>
        <Emoji name={emoji} />
        {dropdownTextInfo && (
          <div className="mb-1 pb-1">
            <Text lighter tag="small" color="muted">
              {dropdownTextInfo}
            </Text>
          </div>
        )}
        <Dropdown id="picker" name={pick === 'Español' ? 'Español/Inglés' : pick}>
          {data.map(value => (
            <DropdownItem
              key={value[JSXRenderingKey]}
              value={value[JSXRenderingItem] === 'Español' ? 'Español/Inglés': value[JSXRenderingItem]}
              onClick={() => onChange({ ...value })}
            />
          ))}
        </Dropdown>  
      </EmojiContainer>
    </>
  )
)

Picker.defaultProps = {
  data: [],
  JSXRenderingKey: 'id',
  dropdownTextInfo: false
}

export default memo(Picker)
