import React from 'react'
import classNames from 'clsx'
import { Button } from 'react-bootstrap'
import './css/index.css'

const AptisButton = ({ children, className, disabled, onClick, type }) => (
  <Button
    type={type}
    variant="secondary"
    className={classNames('custom-buttom', className)}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </Button>
)

AptisButton.defaultProps = {
  type: 'button'
}

export default AptisButton
