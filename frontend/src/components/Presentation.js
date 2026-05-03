import React, { memo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Progress } from 'components/ui'
import PropTypes from 'prop-types'

import Text from 'components/Text'

const Presentation = ({
  content,
  progressBarTitle,
  subtitle,
  title,
  titleImage,
  withProgress
}) => {
  return (
    <Row>
      {withProgress && (
        <React.Fragment>
          <Col md={4}>
            <Text tag="h5" color="muted">
              {progressBarTitle}
            </Text>
          </Col>
          <Col md={8}>
            <Progress />
          </Col>
        </React.Fragment>
      )}
      <Col md={3}>
        <img src={titleImage} alt="title" />
      </Col>
      <Col md={9}>
        <Text tag="h2" color="dark">
          {title}
        </Text>
        <Text tag="h3" color="dark">
          {subtitle}
        </Text>
        <Text tag="p" color="muted">
          {content}
        </Text>
      </Col>
    </Row>
  )
}

Presentation.propTypes = {
  content: PropTypes.string,
  progressBarTitle: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  titleImage: PropTypes.string,
  withProgress: PropTypes.bool
}

export default memo(Presentation)
