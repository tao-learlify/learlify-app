import React from 'react'
import clsx from 'clsx'
import 'assets/css/cards.css'

import Text from 'components/Text'
import { Card, CardBody } from 'components/ui'

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
  <Card>
    <Header>
      <div className="tw:flex tw:flex-wrap">
        {title && (
          <div className="tw:w-full tw:px-4">
            <Text center tag="h3" color='muted'>
              {title}
            </Text>
          </div>
        )}
        {subtitle && (
          <div className="tw:w-full tw:px-4">
            <Text center tag="h6" color='muted'>
              {subtitle}
            </Text>
          </div>
        )}
      </div>  
    </Header>
    <CardBody className={clsx('py-0')}>
      {children}
    </CardBody>
  </Card>
) 


export default Box
