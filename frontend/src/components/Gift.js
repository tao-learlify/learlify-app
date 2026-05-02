import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Form } from 'react-bootstrap'

import { CHANGE_GIFT_EMAIL } from '../store/actions/types'
import { validateEmail } from '../views/settings/validation'

const Gift = () => {
  /**
   * @type {string}
   */
  const giftEmail = useSelector(state => state.gifts.email, shallowEqual)

  const dispatch = useDispatch()

  const onChange = useCallback(
    ({ target: { value } }) => {
      dispatch({
        type: CHANGE_GIFT_EMAIL,
        payload: value
      })
    },
    [dispatch]
  )

  return (
    <React.Fragment>
      <Form.Control
        size="sm"
        type="email"
        placeholder="Correo electrónico"
        value={giftEmail}
        onChange={onChange}
        required
        isValid={validateEmail(giftEmail)}
        isInvalid={!validateEmail(giftEmail)}
      />
    </React.Fragment>
  )
}

export default memo(Gift)
