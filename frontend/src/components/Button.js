import React, { memo } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-width: 0 0 4px;
  padding: 10px 12px;
  background-color: #ffb300;
  font-size: 15px;
  line-height: 20px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  border-style: solid
  transition: filter .2s,-webkit-filter .2s;
  font-weight: 700;
  letter-spacing: .7px;
  text-transform: uppercase;
  cursor: pointer !important;
  border-color: rgba(0,0,0,0)!important;
  border-width: 0 0 4px;
  border-radius: 16px;
  background-clip: padding-box;
  border-style: solid;
  z-index: -1;
`

export default (memo(
 /** 
   * @param {{ color?: string, onClick?: () => void }} ButtonProps
   */
  ({ children, color, onClick, }) => {
  /**
   * @type {React.CSSProperties}
   */
  const css = {
    backgroundColor: color ? color : '#ffb300'
  }

  return (
    <div onClick={onClick}>
      <Button className='text-light' style={css}>
        {children}
      </Button>
    </div>
  )
}))