import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import classNames from 'clsx'
import 'assets/css/cards.css'

import Text from 'components/Text'

import { Header } from './styles'


/**
 * @typedef {Object} BoxProps
 * @property {string?} title
 * @property {string?} subtitle
 * @property {React.ReactNode []} children
 */

/**
 * @type {React.FunctionComponent<BoxProps>}
 */
const Box = ({ children, title, subtitle }) => (
  <Card className={classNames('custom-border')}>
    <Header>
      <Row>
        {title && (
          <Col xs={12}>
            <Text center tag="h3" color='muted'>
              {title}
            </Text>
          </Col>
        )}
        {subtitle && (
          <Col xs={12}>
            <Text center tag="h6" color='muted'>
              {subtitle}
            </Text>
          </Col>
        )}
      </Row>  
    </Header>
    <Card.Body className={classNames('body-style py-0')}>
      {children}
    </Card.Body>
  </Card>
) 


export default Box