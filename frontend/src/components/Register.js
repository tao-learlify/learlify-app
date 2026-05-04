import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import { useDispatch } from 'react-redux'
import { Button } from 'components/ui'
import { ic_email } from 'react-icons-kit/md/ic_email'
import Icon from 'react-icons-kit'

import useAuthProvider from 'hooks/useAuthProvider'
import useLocalStorage from 'hooks/useLocalStorage'
import useToggler from 'hooks/useToggler'

import Animate from './Animate'
import AddUserForm from 'views/dashboard/components/AddUserForm'
import GoogleAuthenticator from './GoogleAuthenticator'
import FlexContainer from './FlexContainer'
import ModalDialog from './ModalDialog'

import { signUpThunk, socialThunk } from 'store/@thunks/auth'
import { unwrapResult } from '@reduxjs/toolkit'

/**
 * @typedef {Object} RegisterProps
 * @property {boolean} enabled
 * @property {boolean} onClose
 * @property {() => void} onComplete
 */

/**
 * @type {React.FunctionComponent<RegisterProps>}
 */
const Register = ({ enabled, onClose, onComplete }) => {
  const { t } = useTranslation()

  const [withOtherEmail, setWithOtherEmail] = useToggler()

  const { loading } = useAuthProvider()

  const dispatch = useDispatch()

  const localStorageProvider = useLocalStorage()

  const handleCloseRequest = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleTokenAccess = token => {
    if (token) {
      localStorageProvider.setItem(token)

      ToastsStore.success(t('AUTHENTICATION.welcome'))

      if (onComplete) {
        onComplete()
      }
    }
  }

  /**
   * @param {User} user
   */
  const handleSubmitRequest = async user => {
    if (user.provider) {
      switch (user.provider) {
        case 'Google':
          const data = Object.assign({}, user)

          delete data.provider

          dispatch(
            socialThunk({
              user: data,
              provider: 'google'
            })
          )
            .then(unwrapResult)
            .then(response => {
              if (response.token) {
                handleTokenAccess(response.token)
              }
            })
            .catch(({ message }) => ToastsStore.warning(message))

          break

        default:
          return
      }
    } else {
      delete user.provider
      
      dispatch(signUpThunk(user))
        .then(unwrapResult)
        .then(response => {
          if (response.token) {
            handleTokenAccess(response.token)
          }
        })
        .catch(({ message }) => ToastsStore.warning(message))

    }
  }

  const handleSuccess = user => {
    handleSubmitRequest({
      ...user.profileObj,
      provider: 'Google'
    })
  }

  return (
    <ModalDialog
      enabled={enabled}
      backdrop="static"
      textHeader={t('AUTHENTICATION.continue')}
      onCloseRequest={handleCloseRequest}
    >
      {withOtherEmail ? (
        <Animate>
          <AddUserForm
            disabled={loading}
            buttonCreateName={t('AUTHENTICATION.signUp')}
            onSubmit={handleSubmitRequest}
          />
        </Animate>
      ) : (
        <div className="container mx-auto px-4">
          <FlexContainer>
            <Button
              className="rounded border"
              block
              variant="outline-dark"
              onClick={setWithOtherEmail}
            >
              {t('AUTHENTICATION.signWithOtherEmail')} <Icon icon={ic_email} />
            </Button>
          </FlexContainer>
          <br />
          <FlexContainer>
            <GoogleAuthenticator disabled={loading} onSuccess={handleSuccess} />
          </FlexContainer>
        </div>
      )}
    </ModalDialog>
  )
}

Register.defaultProps = {
  onComplete: () => null
}

export default memo(Register)
