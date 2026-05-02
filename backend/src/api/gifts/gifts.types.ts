export interface TransactionableGiftInput {
  gifter: {
    id?: number
    email?: string
    firstName?: string
    lastName?: string
    stripeCustomerId?: string
    [key: string]: unknown
  }
  user: {
    id?: number
    email?: string
    firstName?: string
    lastName?: string
    [key: string]: unknown
  }
  plan: {
    id?: number
    price?: number
    currency?: string
    name?: string
    [key: string]: unknown
  }
  stripe: {
    paymentMethodId?: string
    paymentMethod?: string
    source?: string
    [key: string]: unknown
  }
}

export interface GiftGetOneParams {
  id?: number
  serial?: string
  [key: string]: unknown
}

export interface GiftUpdateInput {
  id?: number
  [key: string]: unknown
}
