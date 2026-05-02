import styled from 'styled-components'
import { Col } from 'react-bootstrap'

import { BLUE } from 'assets/colors'
 
export const StyledCol = styled(Col)`
  margin-top: 10px;
`

export const PlanContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 30px;
`

export const BannerContainer = styled.div`
  border-radius: 50px;
  border-width: 2px !important;
`

export const DialogName = styled.small`
  position: absolute;
  top: 50px;
  width: 70px;
  text-align: center;
  font-weight: bold;
  color: ${BLUE};
`

BannerContainer.defaultProps = {
  className: 'border'
}