import type { BillingCycle, SubscriptionStatus } from 'metadata/plans'

export interface CreateSubscriptionInput {
  userId: number
  planPriceId: number
  paymentMethodId: string
  stripeToken?: string
  idempotencyKey: string
}

export interface ActiveSubscriptionResult {
  id: number
  status: SubscriptionStatus
  billing_cycle: BillingCycle
  current_period_end: string
  plan: {
    id: number
    name: string
    code: string
  }
  price: {
    id: number
    billing_cycle: BillingCycle
    currency: string
    final_price: number
  }
}

export interface CancelSubscriptionInput {
  subscriptionId: number
  userId: number
  immediately?: boolean
}

export interface ReactivateSubscriptionInput {
  subscriptionId: number
  userId: number
}

export interface SubscriptionRow {
  id: number
  user_id: number
  plan_id: number
  plan_price_id: number
  status: SubscriptionStatus
  billing_cycle: BillingCycle
  started_at: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at: string | null
  stripe_charge_id: string | null
  stripe_customer_id: string | null
  payment_method_id: string | null
  idempotency_key: string
}

export interface MySubscriptionResult {
  subscription: SubscriptionRow & {
    canCancel: boolean
    canReactivate: boolean
    canUpdatePaymentMethod: boolean
  }
  package: {
    isActive: boolean
    expirationDate: string | null
    credits: {
      speaking: number
      writing: number
      classes: number
    }
  } | null
  ui: {
    primaryLabel: string
    description: string
    showUpgrade: boolean
    purchaseDisabled: boolean
  }
}
