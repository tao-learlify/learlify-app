import React from 'react'
import { Card } from 'components/ui'

const AptisForm = ({ children, headerText, onSubmit }) => {

  return (
    <Card className="my-5 p-2 bg-dark rounded-2xl">
      <Card.Body>
        <h3 className="text-center font-bold text-lg mb-4">{headerText}</h3>
        <form className="form-signin" onSubmit={onSubmit}>
          {children}
        </form>
      </Card.Body>
    </Card>
  )
}

export default React.memo(AptisForm)
