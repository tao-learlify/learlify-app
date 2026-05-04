import React, { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'react-icons-kit'
import { Badge } from 'components/ui'
import { microphone } from 'react-icons-kit/fa/microphone'
import { microphoneSlash } from 'react-icons-kit/fa/microphoneSlash'
import { ic_videocam_off } from 'react-icons-kit/md/ic_videocam_off'
import { ic_videocam } from 'react-icons-kit/md/ic_videocam'
import { ic_screen_share } from 'react-icons-kit/md/ic_screen_share'
import { wechat } from 'react-icons-kit/fa/wechat'
import Animate from 'components/Animate'

import animations from 'utils/animations'
import { ChatContext, ControlsContext } from 'store/context'

import {
  ButtonsControlContainer,
  ButtonControl,
  IconContainer,
  ButtonFigure,
  ButtonFigCaption,
  UnreadMessage
} from './styles'
import Text from 'components/Text'

/**
 * @typedef {Object} MediaSettings
 * @property {boolean} camera
 * @property {boolean} microphone
 */

/**
 * @typedef {Object} ControlsProps
 * @property {() => boolean} handleMicrophone
 * @property {() => boolean} handleCamera
 * @property {() => boolean} handleMediaScreenShare
 * @property {MediaSettings} settings
 */

/**
 * @description
 * This component refers to the control of media inside of Meeting context.
 * @type {React.FunctionComponent<ControlsProps>}
 */
const Controls = ({
  handleMediaScreenShare,
  handleCamera,
  handleMicrophone,
  settings
}) => {
  const { t } = useTranslation()

  const unreads = useContext(ChatContext)

  const handleToggleChat = useContext(ControlsContext)

  return (
    <ButtonsControlContainer>
      <ButtonControl onClick={handleMicrophone}>
        <ButtonFigure>
          <IconContainer state={settings.microphone}>
            <Icon
              size={24}
              icon={settings.microphone ? microphone : microphoneSlash}
            />
          </IconContainer>
          <ButtonFigCaption>
            <Text tag="span" color="light">
              Mic
            </Text>
          </ButtonFigCaption>
        </ButtonFigure>
      </ButtonControl>
      <ButtonControl onClick={handleCamera}>
        <ButtonFigure>
          <IconContainer state={settings.camera}>
            <Icon
              size={24}
              icon={settings.camera ? ic_videocam : ic_videocam_off}
            />
          </IconContainer>
          <ButtonFigCaption>
            <Text tag="span" color="light">
              Cam
            </Text>
          </ButtonFigCaption>
        </ButtonFigure>
      </ButtonControl>
      <ButtonControl onClick={handleMediaScreenShare}>
        <ButtonFigure>
          <IconContainer state>
            <Icon size={24} icon={ic_screen_share} />
          </IconContainer>
          <ButtonFigCaption>
            <Text tag="span" color="light">
              {t('MEETING.share')}
            </Text>
          </ButtonFigCaption>
        </ButtonFigure>
      </ButtonControl>
      <ButtonControl onClick={handleToggleChat}>
        {unreads > 0 ? (
          <ButtonFigure>
            <IconContainer state>
              <Icon size={24} icon={wechat} />
            </IconContainer>
            <ButtonFigCaption>
              <UnreadMessage>
                <Animate animation={animations.BOUNCING_ENTRANCE.BOUNCE_IN}>
                  <Badge variant="danger" pill className="rounded">
                    {unreads}
                  </Badge>
                </Animate>
              </UnreadMessage>
              <Text tag="span" color="light">
                Chat
              </Text>
            </ButtonFigCaption>
          </ButtonFigure>
        ) : (
          <ButtonFigure>
            <IconContainer state>
              <Icon size={24} icon={wechat} />
            </IconContainer>
            <ButtonFigCaption>
              <Text tag="span" color="light">
                Chat
              </Text>
            </ButtonFigCaption>
          </ButtonFigure>
        )}
      </ButtonControl>
    </ButtonsControlContainer>
  )
}

Controls.defaultProps = {
  settings: {
    microphone: false,
    camera: false
  }
}

export default memo(Controls)
