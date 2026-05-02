import { STRIPE_SCRIPT_ID } from 'constant/dom-scripts'

export function getStripeRefElement() {
  return document.getElementById(STRIPE_SCRIPT_ID)
}
