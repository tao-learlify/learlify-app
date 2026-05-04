import React, { memo } from 'react'
import { Badge } from 'components/ui'
import { Card } from 'components/ui'

import CounterItem from './CounterItem'
import FlexContainer from 'components/FlexContainer'
import Text from 'components/Text'

/**
 * @typedef {Object} CountOverviewProps
 * @property {number} speakings
 * @property {number} Writings
 * @property {number} classes
 */
const TextProps = {
  tag: 'small',
  color: 'muted'
}

const BadgeProps = {
  variant: 'info',
  pill: true,
  className: 'ml-1'
}

/**
 * @type {React.FunctionComponent<CountOverviewProps>}
 */
const CountOverview = ({ classes, speakings, writings }) => (
  <FlexContainer>
    <Card elevated>
      <Card.Body>
        <FlexContainer>
          <CounterItem className="mr-2">
            <Text {...TextProps}>
              Clases
            </Text>
            <Badge {...BadgeProps}>
              {classes}
            </Badge>
          </CounterItem>
          <CounterItem className="mr-2">
            <Text {...TextProps}>Speakings</Text>
            <Badge {...BadgeProps}>
              {speakings}
            </Badge>
          </CounterItem>
          <CounterItem className="ml-1">
            <Text {...TextProps}>Writings</Text>
            <Badge {...BadgeProps}>
              {writings}
            </Badge>
          </CounterItem>
        </FlexContainer>
      </Card.Body>
    </Card>
  </FlexContainer>
)

CountOverview.defaultProps = {
  classes: 0,
  writings: 0,
  speakings: 0
}

export default memo(CountOverview)
