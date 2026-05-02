import React, { memo } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { compose } from 'redux'
import { Animated } from 'react-animated-css'
import styled from 'styled-components'

import useEventListener from 'hooks/useEventListener'
import useSettings from 'hooks/useSettings'

import FlexContainer from './FlexContainer'
import Navigation from 'components/Navigation'
import Text from './Text'
import ViewContent from './ViewContent'

import animations from 'utils/animations'
import status from 'utils/status'

import { img } from 'assets/img'

export const ONLINE_EVENT = 'ONLINE_EVENT'
export const OFFLINE_EVENT = 'OFFLINE_EVENT'

/**
 * @typedef {Object} NetworkStatusProps
 * @property {React.Node} children
 * @property {boolean} withNavbar
 */

const onlineStatus = {
  type: ONLINE_EVENT
}

const offlineStatus = {
  type: OFFLINE_EVENT
}

const NetworkStatusOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
`

/**
 * @type {React.FunctionComponent<NetworkStatusProps>}
 */
const NetworkStatus = ({ children, withNavbar }) => {
  const dispatch = useDispatch()
  /**
   * @type {boolean}
   */
  const online = useSettings({ network: true })

  /**
   * See how we are handling network connection in our web app.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events
   */
  useEventListener('online', () => {
    /**
     * @description
     * The event should'nt executed if network status is already online by default.
     */
    dispatch(onlineStatus)
  })

  useEventListener('offline', () => {
    /**
     * @description
     * This event only should be availablehen connection is off through production mode.
     */
    if (import.meta.env.PROD) {
      /**
       * @description
       * Shutting down the content while network is not available.
       */
      dispatch(offlineStatus)
    }
  })

  const tryReconnection = () => {
    window.location.reload()
  }

  return online ? (
    children
  ) : (
    <Animated
      animationIn={animations.FADING_ENTRANCE.fadeIn}
      animationOut={animations.FADING_EXIT.fadeOut}
      visible
    >
      {withNavbar && <Navigation />}
      <NetworkStatusOverlay>
        <ViewContent>
          <FlexContainer>
            <Text bold tag="h3">
              Estás sin conexion actualmente{' '}
              <img lazy="true" src={img['internet-off']} alt="shutdown" />
            </Text>
          </FlexContainer>
          <FlexContainer>
            <Button
              variant="dark"
              className="rounded"
              onClick={tryReconnection}
            >
              Intentar Reconexión{' '}
              <img lazy="true" src={img.wifi} alt="reconnect" />
            </Button>
          </FlexContainer>
        </ViewContent>
      </NetworkStatusOverlay>
    </Animated>
  )
}

NetworkStatus.defaultProps = {
  withNavbar: true
}

export default compose(memo, withRouter)(NetworkStatus)
