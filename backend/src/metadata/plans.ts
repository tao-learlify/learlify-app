/** @deprecated Use PlanCode for new features. Plan enum maps legacy names only. */
export const Plan = {
  APTIS: 'Curso Aptis',
  BLUE: 'Blue',
  DIAMOND: 'Diamond',
  GO: 'Go',
  GOLD: 'Gold',
  GRANDMASTER: 'Grand Master',
  GREEN: 'Green',
  MASTER: 'Master',
  PLATINUM: 'Platinum',
  RUBY: 'Ruby',
  SILVER: 'Silver'
}

export const PlanCode = {
  EXAM_ESSENTIALS: 'exam_essentials',
  APTIS_PRO: 'aptis_pro',
  IELTS_PRO: 'ielts_pro',
  PRO_MAX: 'pro_max',
  LEGACY_SILVER: 'legacy_silver',
  LEGACY_GOLD: 'legacy_gold',
  LEGACY_GREEN: 'legacy_green',
  LEGACY_MASTER: 'legacy_master',
  LEGACY_GRANDMASTER: 'legacy_grandmaster',
  LEGACY_RUBY: 'legacy_ruby',
  LEGACY_APTIS: 'legacy_aptis',
  LEGACY_BLUE: 'legacy_blue',
  LEGACY_DIAMOND: 'legacy_diamond',
  LEGACY_PLATINUM: 'legacy_platinum',
  LEGACY_GO: 'legacy_go',
  LEGACY_IELTS: 'legacy_ielts'
} as const

export type PlanCodeValue = typeof PlanCode[keyof typeof PlanCode]
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly'
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due'
