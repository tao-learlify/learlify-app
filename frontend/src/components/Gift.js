import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

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
      <input
        className="form-control tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:p-2 focus:tw:border-[#58CC02] focus:tw:ring-1 focus:tw:ring-[#58CC02]"
        type="email"
        placeholder="Correo electrónico"
        value={giftEmail}
        onChange={onChange}
        required
      />
    </React.Fragment>
  )
}

export default memo(Gift)
