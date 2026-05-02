import React from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Template from 'components/Template'
import FlexContainer from 'components/FlexContainer'

/**
 * @description
 * Checkpoint is a component for preventing anything done in the application if the user is not already verificated.
 * We must verificated to continue.
 * This must be used as HIGH ORDER COMPONENT.
 * @see https://reactjs.org/docs/higher-order-components.html
 * @returns {React.Component}
 */
const Checkpoint = () => {
  const { t } = useTranslation()

  return (
    <Template withAnimationType="fadeIn">
      <Row>
        <Col className="mx-auto" md={12} xl={12} sm={12} xs={12}>
          <FlexContainer>
            <Alert variant="warning" className="text-center">
              {t('MAILS.checkpoint')}
            </Alert>
          </FlexContainer>
        </Col>
      </Row>
    </Template>
  )
}

export default Checkpoint
