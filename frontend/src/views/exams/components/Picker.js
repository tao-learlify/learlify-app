import React, { Fragment, memo } from 'react'


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
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 text-center">
                  <Core />
                </div>
              </div>
            </CoreContainer>
          </ErrorHandler>
        )

      case VOCABULARY:
        return (
          <ErrorHandler>
            <CoreContainer>
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 text-center">
                  <Core />
                </div>
              </div>
            </CoreContainer>
          </ErrorHandler>
        )

      case CORE:
        return (
          <ErrorHandler>
            <CoreContainer>
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 text-center">
                  <Core />
                </div>
              </div>
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
