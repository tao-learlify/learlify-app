import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'

import { Button } from 'components/ui'
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
    <div className="container mx-auto px-4">
      <div className="tw:py-16 tw:px-8 tw:mb-8 tw:bg-[#58CC02]/10 tw:rounded-2xl">
        <h1>{question.title}</h1>
        <p>Time left: {timeLeft}</p>
      </div>
      <Answers data={answers} />
      <Button
        onClick={() =>
          navigate(`/test/${props.testId}/${Number(props.count) + 1}`)
        }
      >
        Submit
      </Button>
    </div>
  )
}

export default Dashboard
