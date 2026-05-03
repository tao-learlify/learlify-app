import React, { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from 'react-bootstrap'

import Template from 'components/Template'
import Text from 'components/Text'


import { img } from 'assets/compat'
import { BLUE, WHITE } from 'assets/colors'
import 'assets/css/error404.css'
import PATH from 'utils/path'


const Error404 = () => {
  const history = useHistory()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    document.body.style.backgroundColor = BLUE;

    return () => {  
      document.body.style.backgroundColor = WHITE;
    } 
  }, []);

  const pageNotFoundMessage = t('ERRORS.notFound')

  const goToDashboardMessage = t('ERRORS.goIndex')

  return (
    <Template withNavbar={false} view>
      <hr />
      <Row>
        <Col>
          <div className="d-flex justify-content-center">
            <img alt="alien" src={img.alien} />
          </div>
          <br />
          <br />
          <div className="d-flex justify-content-center">
            <Button size="lg" variant="warning" onClick={() => history.push(PATH.DASHBOARD)}>
              {goToDashboardMessage}
            </Button>
          </div>
        </Col>
        <Col className="d-flex justify-content-center align-items-center text-white">
          <Text center tag="h4">
            {pageNotFoundMessage} :(
          </Text>
          <br />
        </Col>
      </Row>
    </Template>
  )
}

export default Error404
