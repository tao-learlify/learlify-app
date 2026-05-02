import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const apiKey = loadStripe(
  import.meta.env.DEV
    ? 'pk_test_EmRwKdbiW0uxJXuw3YEMnqpw00SapOIdsa'
    : 'pk_live_VqdgtS19v86orYFcy5JjrUXj00awUf9dKE'
)

/**
 * @type {React.FunctionComponent<{}>}
 */
const Stripe = ({ children }) => {
  return <Elements stripe={apiKey}>{children}</Elements>
}

export default Stripe
