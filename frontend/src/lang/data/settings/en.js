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
  subtitle: 'Manage your account, subscription, and billing.',
  TABS: {
    membership: 'Membership',
    personal: 'Personal info',
    security: 'Security'
  },
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
    title: 'Payment Methods',
    sectionDescription:
      'Your subscription payments are secure and easy to manage.',
    cardLabel: 'Card',
    expiryLabel: 'Expires',
    defaultBadge: 'Default',
    update: 'Update payment method',
    noCard: 'No payment method registered.',
    // Add card
    addCard: 'Add payment method',
    addCardTitle: 'Add a new card',
    addCardDescription:
      'Your card details are encrypted and processed securely by Stripe.',
    nameOnCard: 'Name on card',
    nameOnCardPlaceholder: 'Full name',
    cardDetails: 'Card details',
    addCardSubmit: 'Save card',
    addCardCancel: 'Cancel',
    addCardAdding: 'Saving...',
    addCardSuccess: "You're all set! Card saved successfully.",
    // Remove
    removeTitle: 'Remove this card?',
    removeBody:
      'This card will be removed from your account. Make sure you have another payment method if needed to keep your subscription active.',
    removeConfirm: 'Yes, remove it',
    removeDismiss: 'Keep it',
    removeRemoving: 'Removing...',
    // Trust
    trust1: 'SSL encrypted',
    trust2: 'PCI compliant',
    trust3: 'Secured by Stripe',
    // Validation
    validNameRequired: 'Please enter the name on the card',
    // Empty state
    emptyTitle: 'No cards yet',
    emptyDescription:
      'Add your first payment method to keep your learning uninterrupted.',
    emptyAdd: 'Add a card',
    // Actions
    actionEdit: 'Update',
    actionRemove: 'Remove'
  },
  PROFILE: {
    title: 'Profile',
    description: 'Manage your name and contact details.',
    editInfo: 'Edit information',
    emailReadOnly: 'Email address cannot be changed'
  },
  SECURITY: {
    title: 'Security',
    accountProtected: 'Your account is secured',
    protectedDesc: 'Your account is protected with a secure password. You can update it below at any time.',
    changePasswordTitle: 'Change password',
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
