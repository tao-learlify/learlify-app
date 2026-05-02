import styled, { css } from 'styled-components'

const FlexContainer = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  @media (max-width: 640px) {
    ${props =>
      props.hiddenMobile &&
      css`
        display: none;
      `}
  } ;
`

FlexContainer.defaultProps = {
  justifyContent: 'center',
  hiddenMobile: false
}

export default FlexContainer
