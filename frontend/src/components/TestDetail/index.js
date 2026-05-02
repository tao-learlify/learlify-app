import React, { memo } from 'react'
import Icon from 'react-icons-kit'
import PropTypes from 'prop-types'
import { circleRight } from 'react-icons-kit/icomoon/circleRight'

import Text from 'components/Text'

import { testDetailLang as lang } from 'components/lang'

import {
  Container,
  IconContainer,
  TextContentContainer,
  TextInitialContainer
} from './styles'

/**
 * @typedef {Object} TestDetailProps
 * @property {string} name
 * @property {() => void} onClick
 */

/**
 * @type {React.FunctionComponent<TestDetailProps>}
 */
const TestDetail = ({ name, onClick }) => {
  return (
    <Container onClick={onClick}>
      <TextInitialContainer>
        <Text bold tag="small" color="dark">
          {name}
        </Text>
      </TextInitialContainer>
      <TextContentContainer>
        <Text tag="small" color="dark" hovered>
          <span>
            <Text bold tag="span">
              {lang.makeTest}
            </Text>
            <IconContainer>
              <Icon icon={circleRight} size={18} className="icon text-orange" />
            </IconContainer>
          </span>
        </Text>
      </TextContentContainer>
    </Container>
  )
}

TestDetail.defaultProps = {
  onClick: null
}

TestDetail.propTypes = {
  name: PropTypes.string
}

export default memo(TestDetail)
