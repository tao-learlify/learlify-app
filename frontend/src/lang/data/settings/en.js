export const settingsEN = {
  cancel: 'Cancel',
  change: 'Switch exam',
  confirm: 'Confirm:',
  edit: 'Edit',
  email: 'Email',
  error: 'There was an error trying to update',
  lastName: 'Last Name',
  model: 'Model',
  name: 'Name',
  password: 'Update Password',
  save: 'Save',
  title: 'Account and Subscription',
  update: 'Updated Successfully',
  validations: {
    mustMatch: 'Passwords do not match',
    lengthRequired: 'Password must be between 8 and 16 characters'
  },
  SUBSCRIPTION: {
    title: 'Membership',
    planLabel: 'Plan',
    billingCycleLabel: 'Billing cycle',
    renewalLabel: 'Next renewal',
    discountLabel: 'Active discount',
    changePlan: 'Change plan',
    cancelSubscription: 'Cancel subscription',
    noRenewal: 'No automatic renewal',
    cancelAtPeriodEndMessage:
      'Your subscription will end on {{date}} and will not renew.',
    perMonth: ' / month',
    STATUS: {
      active: 'Active',
      canceled: 'Canceled',
      past_due: 'Payment due',
      expired: 'Expired',
      trialing: 'Trial period',
      cancel_at_period_end: 'Cancels at period end'
    },
    BILLING_CYCLE: {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    },
    cancelModal: {
      title: 'Cancel subscription?',
      body: 'You will keep access until {{date}}. After that, no further charges will be made.',
      confirm: 'Yes, cancel',
      dismiss: 'No, keep it',
      canceling: 'Canceling...'
    }
  },
  PAYMENT_METHOD: {
    title: 'Payment Method',
    cardLabel: 'Card',
    expiryLabel: 'Valid until',
    update: 'Update payment method',
    noCard: 'No payment method registered.'
  },
  PROFILE: {
    title: 'Profile',
    editInfo: 'Edit information'
  },
  SECURITY: {
    title: 'Security',
    newLabel: 'New password',
    confirmLabel: 'Confirm new password',
    updateButton: 'Update password'
  },
  BILLING_HISTORY: {
    title: 'Billing History',
    date: 'Date',
    amount: 'Amount',
    status: 'Status',
    receipt: 'Receipt',
    download: 'Download',
    empty: 'No invoices yet.',
    STATUS: {
      paid: 'Paid',
      open: 'Pending',
      void: 'Void',
      uncollectible: 'Uncollectible'
    }
  },
  EMPTY_MEMBERSHIP: {
    title: 'No Active Subscription',
    description: 'Choose a plan and start preparing for Aptis today.',
    cta: 'View plans'
  },
  LEGACY: {
    title: 'Access via previous package',
    description:
      'Your current access comes from a previous package. New subscription plans offer more features and flexible billing cycles.',
    cta: 'View new plans'
  }
}
