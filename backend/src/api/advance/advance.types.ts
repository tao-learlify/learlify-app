export interface AdvanceSource {
  courseId: number
  userId: number
}

export interface AdvanceCreateInput extends AdvanceSource {
  content: Record<string, unknown>
}

export interface AdvanceUpdateInput {
  id: number
  [key: string]: unknown
}
