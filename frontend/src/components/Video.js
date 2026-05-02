import React, { memo } from 'react'
import 'assets/css/video.css'

/**
 * @type {React.FunctionComponent<React.VideoHTMLAttributes<HTMLVideoElement>>}
 */
const Video = (props) => {
  return (
    <div className='border'>
      <video {...props} />
    </div>
  )
}

export default memo(Video)