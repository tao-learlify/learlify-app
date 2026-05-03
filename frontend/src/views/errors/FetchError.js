import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Template from 'components/Template'
import FlexContainer from 'components/FlexContainer'
import Text from 'components/Text'

import styles from './styles.module.scss'

import { img } from 'assets/compat'
import { clearAsyncError } from 'store/@actions'

import PATH from 'utils/path'

/**
 * @description
 * Display this component when a fetch error occurs in general.
 */
const FetchError = () => {
  const history = useHistory()

  const dispatch = useDispatch()

  const { t } = useTranslation()

  /**
   * @description
   * Redirects to dashboard and clear the async error.
   */
  const clearAsyncErrorDispatcher = () => {
    history.push(PATH.DASHBOARD)

    dispatch(clearAsyncError())
  }

  const fetchServiceErrorMessage = t('ERRORS.cannotGET')

  const fetchServiceErrorDashboardMessage = t('ERRORS.dashboard')

  return (
    <Template WithNetworkHandler={false} view>
      <div className={styles.container}>
        <FlexContainer>
          <img src={img.error} alt="error" />
        </FlexContainer>
        <Text bold center color="gray" tag="h3">
          {fetchServiceErrorMessage}
        </Text>
        <FlexContainer>
          <Button onClick={clearAsyncErrorDispatcher} variant="info">
            {fetchServiceErrorDashboardMessage}
          </Button>
        </FlexContainer>
      </div>
    </Template>
  )
}

export default FetchError
