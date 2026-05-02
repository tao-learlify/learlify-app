import styled from 'styled-components'

export const Container = styled.div`
  margin-top: 6.5px;
`

export const ReportContainer = styled.div`
  position: absolute;
  @media screen and (max-width: 695px) {
    margin-top: 0.4rem;
    left: 0;
  }
  @media screen and (max-width: 1099px) {
    left: 30px;
    margin-right: 2rem;
  }
`