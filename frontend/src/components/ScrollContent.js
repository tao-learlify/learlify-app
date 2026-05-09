import React from 'react'

export default function ScrollContent({ scroll = 0 }) {
  return (
    <div
      className="tw:fixed tw:w-full tw:z-[3] tw:h-[5px]"
      style={{
        background: `linear-gradient(to right, rgba(250,224,66,0.8) ${scroll}%, transparent 0)`,
      }}
    />
  )
}
