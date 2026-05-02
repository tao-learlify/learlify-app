import React, { memo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Text from './Text'
import Display from './Display'

import { img } from 'assets/img'
import { Animated } from 'react-animated-css'

const CompletedUnit = () => {
  const { t } = useTranslation()

  return (
    <Animated animationIn="fadeInUp">
      <Row>
        <Col md={10}>
          <Text dunkin color="blue" tag="h2">
            {t('COMPONENTS.completedUnit.placeholder.congrats')}
          </Text>
          <Text lighter color="dark" tag="h4">
            {t('COMPONENTS.completedUnit.placeholder.effort')}
          </Text>
          <Text lighter color="muted" tag="h5">
            {t('COMPONENTS.completedUnit.placeholder.results')}
          </Text>
          <Row>
            <Col md={8}>
              <Display>
                <Text bold lighter color="secondary" tag="p">
                  {t('COMPONENTS.completedUnit.placeholder.machine')}
                  <img lazy="true" src={img.student} alt="student" />
                </Text>
              </Display>
            </Col>
          </Row>
        </Col>
      </Row>
    </Animated>
  )
}

export default memo(CompletedUnit)
