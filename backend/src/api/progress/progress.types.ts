export interface ProgressSource {
  examId?: number
  userId?: number
  id?: number
  data?: Record<string, unknown>
  [key: string]: unknown
}

export interface ProgressCategoryFeedback {
  feedback: unknown[]
  lastIndex: number
  points: number
  score: number
}

export interface ProgressCategorySpeaking {
  cloudStorageRef: number[][]
  lastIndex: number
  completed?: boolean
}

export interface ProgressCategoryWriting {
  feedback: unknown[]
  lastIndex: number
  completed?: boolean
}

export interface ProgressStructure {
  uuid?: string
  'Grammar & Vocabulary': ProgressCategoryFeedback
  Listening: ProgressCategoryFeedback
  Reading: ProgressCategoryFeedback
  Speaking: ProgressCategorySpeaking
  Writing: ProgressCategoryWriting
  [key: string]: unknown
}

export interface EagerRelationConfig {
  create: Record<string, unknown>
  getOne: Record<string, unknown>
  updateOne: Record<string, unknown>
}

export interface FeedbackTransactionRef {
  package: { userId: number; isActive: boolean }
  user: { id: number; email: string; [key: string]: unknown }
  category: { id: number; name: string; [key: string]: unknown }
  progress: { id: number; data: ProgressStructure; exam?: Record<string, unknown>; [key: string]: unknown }
  feedback: unknown
  lastIndex: number
  recordings: Express.Multer.File[]
  model: { id: number; name?: string; [key: string]: unknown }
}

export interface FeedbackTransactionParams {
  applySubscriptionDiscount: boolean
  ref: FeedbackTransactionRef
}

export interface FeedbackTransactionSuccess {
  evaluation: Record<string, unknown>
  feedback: boolean
}

export interface FeedbackTransactionError {
  transactionError: boolean
  requiresPayment: boolean
}

export type FeedbackTransactionResult =
  | boolean
  | FeedbackTransactionSuccess
  | FeedbackTransactionError

export interface UpdateScoreParams {
  context: boolean
  data: { id: number; [key: string]: unknown }
  score: {
    ref: Record<string, unknown>
    user: { categoryId: number; examId: number; userId: number }
    email: string
  }
}

export interface UpdateScoreSuccess {
  notification: Record<string, unknown>
  progress: Record<string, unknown>
  stats: Record<string, unknown>
}

export interface UpdateScoreNoContext {
  progress: Record<string, unknown>
  stats: null
}

export interface UpdateScoreError {
  transactionError: boolean
}

export type UpdateScoreResult =
  | UpdateScoreSuccess
  | UpdateScoreNoContext
  | UpdateScoreError
