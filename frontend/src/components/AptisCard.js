import React, { memo } from 'react'
import { Card, Row, Col } from 'react-bootstrap'

import Text from './Text'

import 'assets/css/cards.css'


/**
 * @typedef {Object} AptisCardProps
 * @property {boolean} alternative
 * @property {{ main?: string, sub?: string  }} alternativeTextHeaders
 * @property {string} title
 * @property {string} titleColor
 * @property {TextTag} titleTag
 */

/**
 * @type {React.FunctionComponent<AptisCardProps>}
 */
const AptisCard = ({
  title,
  titleColor,
  titleTag,
  children,
  alternative,
  alternativeTextHeaders
}) => {

  return alternative ? (
    <Card className={"custom-border bg-light"}>
      <Card.Header>
        <Row>
          <Col md={12}>
            <Text center color='muted' tag={titleTag}>
              {alternativeTextHeaders.main}
            </Text>
          </Col>
          <Col md={12}>
            <Text center color='muted' tag="h6">
              {alternativeTextHeaders.sub}
            </Text>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="body-style py-0">
        {children}
      </Card.Body>
    </Card>
  ) : (
    <Card className={"custom-border bg-light"}>
      <Card.Header>
        <Text center color={titleColor} tag={titleTag}>
          {title}
        </Text>
      </Card.Header>
      <Card.Body className="body-style">{children}</Card.Body>
    </Card>
  )
}

AptisCard.defaultProps = {
  titleColor: 'muted',
  titleTag: 'h3'
}

export default memo(AptisCard)
