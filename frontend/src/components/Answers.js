import React from 'react'

import radio from './AnswerTypes/Radio'

const types = {
  radio
}

function Answers(props) {
  const answers = props.data || []
  return (
    <div>
      <form>
        {answers.map(answer => types[answer.type]({ value: answer.value }))}
      </form>
    </div>
  )
}

export default Answers
