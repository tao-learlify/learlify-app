import React from 'react'
import { Button } from 'components/ui'
import { useTranslation } from 'react-i18next'

import Text from 'components/Text'

import FlexContainer from 'components/FlexContainer'
import { img } from 'assets/compat'

const MediaStreamError = () => {
  const { t } = useTranslation()

  /**
   * @description
   * Forces to reload on attempt reconnection.
   */
  function onAttemptReconnection() {
    window.location.reload()
  }

  return (
    <React.Fragment>
      <div className="text-center">
        <img src={img.settings} alt="device-not-found" />
      </div>
      <br />
      <Text center tag="p" color="muted">
        {t('COMPONENTS.MEDIA_STREAM_ERROR.line1')} <br />
        <span className="text-info">
          {t('COMPONENTS.MEDIA_STREAM_ERROR.line2')}
        </span>
        :
        <br />
        {t('COMPONENTS.MEDIA_STREAM_ERROR.line3')}
        <br />
        {t('COMPONENTS.MEDIA_STREAM_ERROR.line4')}
        <br />
        {t('COMPONENTS.MEDIA_STREAM_ERROR.line5')}
        <br />
        {t('COMPONENTS.MEDIA_STREAM_ERROR.line6')}
      </Text>
      <FlexContainer>
        <Button onClick={onAttemptReconnection} size="sm" variant="info">
          {t('COMPONENTS.MEDIA_STREAM_ERROR.reconnect')}
        </Button>
      </FlexContainer>
    </React.Fragment>
  )
}

export default MediaStreamError
