import { Card } from 'react-bootstrap'
import styled from 'styled-components'

export const Header = styled(Card.Header)`
  &:first-child {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border: 5px solid #d9d9d9;
    border-bottom: none;
    background-color: #FFFFFF;
  }
`