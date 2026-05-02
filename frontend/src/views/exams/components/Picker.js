import React, { Fragment, memo } from 'react'
import { Row, Col } from 'react-bootstrap'

import useExamConsumer from 'hooks/useExamConsumer'

import Core from 'components/Core'
import Listening from 'components/Listening'
import Reading from 'components/Reading'
import Speaking from 'components/Speaking'
import Writing from 'components/Writing'

import {
  CoreContainer,
  ListeningContainer,
  ReadingContainer,
  WritingContainer
} from './styles'
/**
 * Utils
 */
import 'assets/css/speaking.css'
import ErrorHandler from 'views/errors'
import {
  CORE,
  GRAMMAR,
  LISTENING,
  READING,
  SPEAKING,
  VOCABULARY,
  WRITING
} from 'constant/labels'

/**
 * @type {React.FunctionComponent<ExamProps>}
 */
const Picker = ({ render }) => {
  const { exercise } = useExamConsumer()

  if (exercise) {
    switch (render) {
      case GRAMMAR:
        return (
          <ErrorHandler>
            <CoreContainer>
              <Row>
                <Col xs={12} className="text-center">
                  <Core />
                </Col>
              </Row>
            </CoreContainer>
          </ErrorHandler>
        )

      case VOCABULARY:
        return (
          <ErrorHandler>
            <CoreContainer>
              <Row>
                <Col xs={12} className="text-center">
                  <Core />
                </Col>
              </Row>
            </CoreContainer>
          </ErrorHandler>
        )

      case CORE:
        return (
          <ErrorHandler>
            <CoreContainer>
              <Row>
                <Col xs={12} className="text-center">
                  <Core />
                </Col>
              </Row>
            </CoreContainer>
          </ErrorHandler>
        )

      case LISTENING:
        return (
          <>
            <ErrorHandler>
              <ListeningContainer>
                <Listening />
              </ListeningContainer>
            </ErrorHandler>
          </>
        )

      case READING:
        return (
          <ErrorHandler>
            <ReadingContainer>
              <Reading />
            </ReadingContainer>
          </ErrorHandler>
        )

      case WRITING:
        return (
          <ErrorHandler>
            <WritingContainer>
              <Writing />
            </WritingContainer>
          </ErrorHandler>
        )

      case SPEAKING:
        return (
          <ErrorHandler>
            <Speaking />
          </ErrorHandler>
        )

      default:
        return <Fragment />
    }
  }
}

export default memo(Picker)
