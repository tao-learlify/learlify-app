import React from 'react'
import { Card, Form } from 'react-bootstrap'

const AptisForm = ({ children, headerText, onSubmit }) => {

  return (
    <Card className='card-sigin my-5 p-2 bg-dark'>
      <Card.Body>
        <Card.Title className="text-center">{headerText}</Card.Title>
        <Form className="form-signin" onSubmit={onSubmit}>
          {children}
        </Form>
      </Card.Body>
    </Card>
  )
}

export default React.memo(AptisForm)
