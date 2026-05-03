import React from 'react'
import clsx from 'clsx'

export default function Avatar({ src, alt, className, size = 46, ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx('tw:rounded-full tw:object-cover', className)}
      style={{ width: size, height: size }}
      {...rest}
    />
  )
}
