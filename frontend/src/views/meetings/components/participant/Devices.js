import React, { memo } from 'react'
import Icon from 'react-icons-kit'
import { microphoneSlash } from 'react-icons-kit/fa/microphoneSlash'
import { ic_videocam_off } from 'react-icons-kit/md/ic_videocam_off'

/**
 * @typedef {Object} DeviceProps
 * @property {{ microphone: boolean, camera: boolean }} settings
 */

/**
 * @type {React.FunctionComponent<DeviceProps>}
 */
const Devices = ({ settings }) => (
  <React.Fragment>
    &nbsp;
    {settings.microphone || (
      <Icon className="text-danger" icon={microphoneSlash} />
    )}
    &nbsp;
    {settings.camera || <Icon className="text-danger" icon={ic_videocam_off} />}
  </React.Fragment>
)

Devices.defaultProps = {
  settings: {
    microphone: false,
    camera: false
  }
}

export default memo(Devices)
