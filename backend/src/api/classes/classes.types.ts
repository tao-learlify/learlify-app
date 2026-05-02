export interface ClassModel {
  id: number
  scheduleId: number
  name: string
  expired: boolean
}

export interface IndicationsBody {
  level: string
  about: string
}

export interface CreateClassBody {
  scheduleId: number
  packageId: number
  indications: string
}

export interface GetOneClassParams {
  id?: number
  name?: string
  scheduleId?: number
}

export interface GetAllClassParams {
  user?: number
  teacher?: number
  expired: boolean
  limit?: number
  count?: boolean
  options?: { teacherId: number }
}

export interface CreateClassInput {
  package: { id: number; classes: number }
  schedule: { id: number }
  user: { id: number; email: string }
  name: string
  notified: boolean
  timezone: string | undefined
}

export interface ClassTransactionSuccess {
  room: ClassModel
  package: unknown
  meeting: unknown
  schedule: unknown
}

export interface ClassTransactionError {
  error: boolean
  stack: string
}

export type ClassTransactionResult = ClassTransactionSuccess | ClassTransactionError

export interface ScheduleTimezone {
  startDate: string
  endDate: string
  anticipatedStartDate: string
}

export interface RelationshipGetOne {
  meetings: { $modify: string[] }
  schedule: { $modify: string[] }
}

export interface RelationshipGetAll {
  graph: string
  foreignKeyUser: string
  foreignKeyTeacher: string
  modifiers?: unknown
}

export interface RelationshipCount {
  graph: string
  foreignKey: string
}

export interface RelationshipConfig {
  getOne: RelationshipGetOne
  getAll: RelationshipGetAll
  count: RelationshipCount
}
