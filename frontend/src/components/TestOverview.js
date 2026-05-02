import React, { memo } from 'react'
import Icon from 'react-icons-kit'
import { Card, Container, Collapse } from 'react-bootstrap'
import { ic_keyboard_arrow_down } from 'react-icons-kit/md/ic_keyboard_arrow_down'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'

import TestDetail from './TestDetail'

import useToggler from 'hooks/useToggler'

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TestOverview = ({ examData, testName }) => {
  const [open, setOpen] = useToggler(false)

  return (
    <React.Fragment>
      <Card aria-controls="collapse" aria-expanded={open}>
        <FlexContainer>
          <h6 className="p-2 mt-1 ml-2 text-muted">{testName}</h6>
          <Icon
            onClick={setOpen}
            icon={ic_keyboard_arrow_down}
            className="icon-test p-2"
            size={24}
          />
        </FlexContainer>
      </Card>
      <Collapse in={open}>
        <Container id="collapse">
          {examData.map((data, index) => (
            <TestDetail
              examId={data.id}
              type={data.type}
              name={`${index + 1}. ${data.type}`}
              info={'....'}
            />
          ))}
        </Container>
      </Collapse>
    </React.Fragment>
  )
}

export default compose(
  withRouter,
  memo
)(TestOverview)
