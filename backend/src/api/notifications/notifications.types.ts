export interface NotificationData {
  senderId?: number
  userId: number
  message?: string
  read?: boolean
  deleted?: boolean
  type: number
  createdAt?: Date
  updatedAt?: Date
  expirationDate?: Date
}

export interface NotificationTypeRecord {
  id: number
  name: string
  template?: string
  expirationTime: number
}

export interface GetAllNotificationsParams {
  userId: number
  page?: number
  unreads?: boolean
  read?: boolean
}

export interface PaginatedResponse<T> {
  results: T[]
  total: number
}

export interface UpdateNotificationData {
  read?: boolean
  deleted?: boolean
}

export interface RealtimeNotificationParams {
  context: string
  user: { email: string }
  [key: string]: unknown
}

export interface PaginationStackInput {
  limit: number
  page: number | string
  total: number
}
