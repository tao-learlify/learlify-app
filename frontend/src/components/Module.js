import React from 'react'

import useExamConsumer from 'hooks/useExamConsumer'

import Core from './Core'
import Reading from './Reading'
import Listening from './Listening'
import Speaking from './Speaking'
import Writing from './Writing'
import { GRAMMAR, LISTENING, READING, SPEAKING, WRITING } from 'constant/labels'

const renderWithContext = true

const Module = ({ children }) => {

  const { exercise } = useExamConsumer()

  switch(renderWithContext) {
    case exercise.label.includes(GRAMMAR):
      return <Core>{children}</Core>

    case exercise.label.includes(READING):
      return <Reading>{children}</Reading>

    case exercise.label.includes(LISTENING):
      return <Listening>{children}</Listening>

    case exercise.label.includes(SPEAKING):
      return <Speaking>{children}</Speaking>

    case exercise.label.includes(WRITING):
      return <Writing>{children}</Writing>

    default:
      return <React.Fragment />
  }
}

export default Module