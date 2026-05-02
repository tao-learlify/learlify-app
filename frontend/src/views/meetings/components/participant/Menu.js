import React, { memo } from 'react'
import Icon from 'react-icons-kit'
import { ic_fullscreen } from 'react-icons-kit/md/ic_fullscreen'
import { ic_settings } from 'react-icons-kit/md/ic_settings'

import {
  ButtonControl,
  ButtonFigure,
  ButtonFigCaption,
  SettingsContainer
} from './styles'

/**
 * @typedef {Object} MenuProps
 * @property {boolean} controls
 * @property {boolean} status
 * @property {string} id
 * @property {() => void} handleFullScreen
 * @property {() => void} handleExitFullScreen
 * @property {() => void} handleConfiguration
 */

/**
 * @type {React.FunctionComponent<MenuProps>}
 */
const Menu = ({
  controls,
  handleFullScreen,
  handleConfiguration,
  status,
  ...props
}) => {
  return (
    status && (
      <SettingsContainer id={props.id}>
        <ButtonControl onClick={handleFullScreen}>
          <ButtonFigure settings>
            <Icon size={16} icon={ic_fullscreen} />
            <ButtonFigCaption settings>Pantalla Completa</ButtonFigCaption>
          </ButtonFigure>
        </ButtonControl>
        {controls && (
          <ButtonControl onClick={handleConfiguration}>
            <ButtonFigure settings>
              <Icon size={16} icon={ic_settings} />
              <ButtonFigCaption settings>Configuración</ButtonFigCaption>
            </ButtonFigure>
          </ButtonControl>
        )}
      </SettingsContainer>
    )
  )
}

Menu.defaultProps = {
  id: 'settings'
}

export default memo(Menu)
