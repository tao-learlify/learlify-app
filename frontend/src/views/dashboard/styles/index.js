import styled from 'styled-components'


/**
 * @type {React.CSSProperties} searchStyles
 */
export const searchStyles = {
  position: 'relative',
  bottom: 3
}

/**
 * @type {React.CSSProperties} searchStyles
 */
export const prependStyles = {
  ...searchStyles,
  height: 30
}

export const BannerContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const ViewContainer = styled.div`
  margin-top: 15px;
`

export const RowContainer = styled.div`
  margin-top: 15px;
`

export const PaperContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 7.5px;
  padding-top: 7.5px;
`

export const TestDetailItemContainer = styled.div`
  margin-bottom: 5px;
`