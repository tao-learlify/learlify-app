import React from 'react'
import styled from 'styled-components'
import { GooSpinner } from 'react-spinners-kit'
import { Container } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Animated } from 'react-animated-css'
import classNames from 'clsx'
import lang from 'lang'



import 'assets/css/template.scss'
import 'react-pro-sidebar/dist/css/styles.css'


import FlexContainer from 'components/FlexContainer'
import Navigation from 'components/Navigation'
import NetworkStatus from 'components/NetworkStatus'
import Text from 'components/Text'
import Videos from 'components/Videos'

import useEventListener from 'hooks/useEventListener'

import { GRAY } from 'assets/colors'
import { updateNetwork } from 'store/@reducers/settings'

import styles from './template.module.scss'

export const TextSpinnerContainer = styled.div`
  margin-top: 30px;
  margin-left: 25px;
`

/**
 * @typedef {Object} TemplateProps
 * @property {string} color
 * @property {string} loaderIndicatorName
 * @property {boolean} view
 * @property {string} withAnimationType
 * @property {boolean} withLoader
 * @property {boolean} withNavbar
 * @property {boolean} withoutSpace
 * @property {boolean} WithNetworkHandler
 * @property {boolean} withSocket
 * @property {boolean} withSidebar
 */

/**
 * @type {React.FunctionComponent<TemplateProps>}
 */
const Template = ({
  children,
  color,
  loaderIndicatorName,
  withoutSpace,
  withLoader,
  withNavbar,
  withVideos,
  view
}) => {
  const dispatch = useDispatch()

  useEventListener('online', () => {
    const networkIsAvailable = true

    dispatch(updateNetwork(networkIsAvailable))
  })

  useEventListener('offline', () => {
    const networkIsUnavailable = false

    dispatch(updateNetwork(networkIsUnavailable))
  })

  return (
    <NetworkStatus>
      {withNavbar && <Navigation color={color} />}
      {withLoader ? (
        <Container className={styles.loading}>
          <Animated animationIn="fadeIn">
            <FlexContainer>
              <GooSpinner size={120} color={GRAY} />
            </FlexContainer>
            <Text center tag="h5">
              {loaderIndicatorName}
            </Text>
          </Animated>
        </Container>
      ) : view ? (
        <Animated animationIn="fadeIn">
          <Container
            className={classNames(
              view && styles.view,
              withoutSpace && styles.withoutSpace
            )}
          >
            {children}
          </Container>
          {withVideos && !withLoader && (
            <>
              <br />
              <Videos />
            </>
          )}
        </Animated>
      ) : (
        <>
          {children}
          {withVideos && !withLoader && (
            <>
              <br />
              <Videos />
            </>
          )}
        </>
      )}
    </NetworkStatus>
  )
}

Template.defaultProps = {
  withSocket: true,
  withNavbar: true,
  withSidebar: false,
  withLoader: false,
  WithNetworkHandler: true,
  withoutSpace: false,
  loaderIndicatorName: lang.t('LOADING_INDICATOR.updating'),
  withAnimationType: 'fadeIn'
}

export default React.memo(Template)
