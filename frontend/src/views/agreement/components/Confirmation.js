import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TitleContainer,
  TextInfo,
  ImageContainer,
  KeyPointContainer,
  KeyPoint,
  KeyPointText,
  Check
} from './styles'

import { img } from 'assets/compat'

const Checked = () => {
  return <Check src={img['check-mark']} alt="check" />
}

/**
 * @typedef {Object} ConfirmationProps
 * @property {Date} startDate
 * @property {Date} endDate
 * @type {React.FunctionComponent<ConfirmationProps>}
 */
const Confirmation = () => {
  const { t } = useTranslation()

  return (
    <>
      <TitleContainer>{t('AGREEMENT.CONFIRMED.title')}</TitleContainer>
      <KeyPointContainer>
        <div>
          <KeyPoint>
            <Checked />
            <KeyPointText>{t('AGREEMENT.CONFIRMED.about')}</KeyPointText>
          </KeyPoint>
          <KeyPoint>
            <Checked />
            <KeyPointText>{t('AGREEMENT.CONFIRMED.mail')}</KeyPointText>
          </KeyPoint>
          <KeyPoint>
            <Checked />
            <KeyPointText>{t('AGREEMENT.CONFIRMED.reminder')}</KeyPointText>
          </KeyPoint>
        </div>
        <ImageContainer>
          <img src={img.pending} alt="completed" />
        </ImageContainer>
      </KeyPointContainer>
      <TextInfo>{t('AGREEMENT.CONFIRMED.notification')}</TextInfo>
    </>
  )
}

export default Confirmation
