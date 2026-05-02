/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { WhisperSpinner } from 'react-spinners-kit'
import { useHistory } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { unwrapResult } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'

import FlexContainer from 'components/FlexContainer'
import Template from 'components/Template'
import Text from 'components/Text'

import useAuthProvider from 'hooks/useAuthProvider'
import useLocalStorage from 'hooks/useLocalStorage'
import useQuery from 'hooks/useQuery'
import useQueryValidation from 'hooks/useQueryValidation'

import PATH from 'utils/path'
import { GRAY, TURQUOISE } from 'assets/colors'
import { verificationThunk } from 'store/@thunks/auth'

/**
 * @description
 * This component renders a verification in the process of email.
 * After that the user will be redirected to dashboard to select his customization process.
 * @returns {React.Component}
 */
const Verification = () => {
  const user = useAuthProvider()

  const ls = useLocalStorage()

  const dispatch = useDispatch()

  const history = useHistory()

  const { t } = useTranslation()

  const { code } = useQuery()

  /**
   * @description
   * Once this component is loaded, will check the user's profile token.
   * The user.verifyCodeFromEmailOrigin is a client side validation for the token, and checking that the actual tokens have the same email origin.
   * If not, the user simply will be redirected to path models route.
   * @requires useAuthProvider
   */
  useEffect(() => {
    user.verifyCodeFromEmailOrigin(user.profile.token, () =>
      dispatch(verificationThunk({ code }))
        .then(unwrapResult)
        .then(() => {
          ls.setItem(user.profile.token)
        })
        .catch(({ message }) => {
          ls.removeItem()
          
          ToastsStore.warning(message)

          window.location.href = "/"
        })
        .finally(() => {
          history.push({
            pathname: PATH.MODELS
          })
        })
    )
  }, [code, dispatch, user.profile])

  /**
   * @description
   * Query validation must be include "code" in the request parameters in the browser.
   */
  useQueryValidation(
    {
      required: ['code']
    },
    exception => {
      exception && history.push(PATH.DASHBOARD)
    }
  )

  return (
    <Template withAnimationType="fadeIn" view>
      {user.loading && (
        <React.Fragment>
          <FlexContainer>
            <WhisperSpinner size={60} frontColor={GRAY} backColor={TURQUOISE} />
          </FlexContainer>
          <br />
          <Text center color="gray" tag="h5">
            {t('LOADING_INDICATOR.verificating')}
          </Text>
        </React.Fragment>
      )}
    </Template>
  )
}

export default Verification
