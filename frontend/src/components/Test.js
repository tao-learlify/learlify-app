import React, { useState, useEffect } from 'react'
import { Jumbotron, Container, Button } from 'react-bootstrap'
import { navigate } from '@reach/router'

import { getQuestion } from '../actions/tests'

import Answers from './Answers'

function Dashboard(props) {
  const [question, setQuestion] = useState({})
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    getQuestion(props.testId).then(data => {
      if (!question.title) {
        setQuestion(data.question)
        setAnswers(data.answers)
        setTimeLeft(data.timeLeft)
      }
    })
  })

  setTimeout(() => {
    setTimeLeft(timeLeft - 10)
  }, 1000)

  return (
    <Container>
      <Jumbotron>
        <h1>{question.title}</h1>
        <p>Time left: {timeLeft}</p>
      </Jumbotron>
      <Answers data={answers} />
      <Button
        onClick={() =>
          navigate(`/test/${props.testId}/${Number(props.count) + 1}`)
        }
      >
        Submit
      </Button>
    </Container>
  )
}

export default Dashboard
