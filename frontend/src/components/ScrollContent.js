import styled from 'styled-components'

const ScrollContent = styled.div`
  position: fixed;
  backround: linear-gradient(
    to right,
    rgba(250, 224, 66, 0.8) ${props => props.scroll},
    transparent 0
  );
  width: 100%;
  height: 5px;
  z-index: 3;
`

export default ScrollContent
