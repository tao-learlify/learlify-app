import React, { memo, useState, useEffect } from 'react'
import { Col, Container, Row, ListGroup } from 'react-bootstrap'
import { ModuleRegExp } from 'common/module.regexp'

import Dropdown from 'components/Dropdown'
import DropdownItem from 'components/DropdownItem'
import Dropup from 'components/Dropup'
import FlexContainer from 'components/FlexContainer'
import Management from 'components/Management'
import TableHeader from 'components/TableHeader'
import Text from 'components/Text'
import TableRow from 'components/TableRow'
import RegExpIntercept from 'components/RegExpIntercept'

import useExamConsumer from 'hooks/useExamConsumer'

import { chainArray as chain, removeMatch, shuffle } from 'utils/functions'

import { DisplayContainer } from './styles'
import { GRAMMAR, VOCABULARY } from 'constant/labels'

import styles from './core.module.scss'
import { img } from 'assets/img'

/**
 * @type {React.FunctionComponent<CoreProps>}
 */
const Core = () => {
  const { exercise } = useExamConsumer()

  switch (exercise.label) {
    case GRAMMAR:
      return <Grammar />

    case VOCABULARY:
      return <Vocabulary chained />

    default:
      return <React.Fragment />
  }
}

/**
 * @type {React.FunctionComponent<CoreProps>}
 */
const Grammar = () => {
  const { selection, exercise, handleSelection } = useExamConsumer()

  return (
    <div className={styles.padding}>
      <br />
      <Text dunkin center color="blue" tag="h3">
        Select the correct answer <img alt="core" width={30} height={30} src={img.core} />
      </Text>
      <hr />
      {exercise.title && (
        <RegExpIntercept
          expression={ModuleRegExp.intercept}
          fragment={true}
          value={exercise.title}
        >
          <DisplayContainer className="dropdown-test d-inline">
            <Dropdown id={exercise.title} name={selection.title}>
              {exercise.answers.map((answer, index) => (
                <DropdownItem
                  key={answer}
                  value={answer}
                  onClick={() =>
                    handleSelection({
                      title: answer,
                      index: index
                    })
                  }
                />
              ))}
            </Dropdown>
          </DisplayContainer>
        </RegExpIntercept>
      )}
    </div>
  )
}

const defaultFontSize = {
  fontSize: 14
}

/**
 * @type {React.FunctionComponent<CoreProps>}
 */
const Vocabulary = ({ chained }) => {
  const [schema, setSchema] = useState([])

  const { selections, disabled, exercise, handleSelection } = useExamConsumer()

  const { description, questions } = exercise

  const setSchemaCallback = () => {
    const extended = chain(questions, 'answers')

    setSchema(shuffle(extended))
  }

  useEffect(setSchemaCallback, [questions])

  return (
    <div className={styles.padding}>
      <br />
      <Text center dunkin color="blue" tag="small">
        {description} <img lazy="true" alt="core" width={30} height={30} src={img.core} />
      </Text>
      <hr />
      <Container>
        <Row>
          <Col md={12}>
            <Management alternative rows={['Word', 'Meaning']}>
              {questions.map(
                (question, qIndex) =>
                  question.title && (
                    <RegExpIntercept
                      key={question.title}
                      value={question.title}
                      expression={ModuleRegExp.intercept}
                      splitChars={false}
                    >
                      <TableRow key={question.title}>
                        <TableHeader>
                          <Text bold tag="p">
                            <span style={defaultFontSize}>
                              {removeMatch(question.title)}
                            </span>
                          </Text>
                        </TableHeader>
                        <TableHeader>
                          <FlexContainer className="dropdown-lg">
                            <Dropup
                              className="btn btn-light border dropdown-style"
                              disabled={disabled}
                              name={selections[qIndex]}
                            >
                              {chained
                                ? schema.map(answer => (
                                    <DropdownItem
                                      disabled={selections.includes(answer)}
                                      key={answer}
                                      value={answer}
                                      onClick={() =>
                                        handleSelection({
                                          title: answer,
                                          index: qIndex
                                        })
                                      }
                                    />
                                  ))
                                : question.answers.map(answer => (
                                    <DropdownItem
                                      key={answer}
                                      value={answer}
                                      onClick={() =>
                                        handleSelection({
                                          title: answer,
                                          index: qIndex
                                        })
                                      }
                                    />
                                  ))}
                            </Dropup>
                          </FlexContainer>
                        </TableHeader>
                      </TableRow>
                    </RegExpIntercept>
                  )
              )}
            </Management>
          </Col>
          <Col md={12}>
            <ListGroup className="list-group-horizontal-sm">
              {schema.map(answer => (
                <ListGroup.Item key={answer} className="p-2 flex-fill shadow">
                  {removeMatch(answer)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

Core.defaultProps = {
  questions: [],
  answers: []
}

export default memo(Core)
