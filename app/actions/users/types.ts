export type UserRole = "USER" | "ADMIN" | "SYSADMIN"

import type { PreferredCurrency, TimeZone, PreferredLanguage } from "@/utils/user-preferences"
export type { PreferredCurrency, TimeZone, PreferredLanguage } from "@/utils/user-preferences"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  preferredCurrency: PreferredCurrency
  timeZone: TimeZone
  preferredLanguage: PreferredLanguage
  isActive: boolean
  /** ISO 8601 cuando el correo fue verificado; ausente o null si no lo está. */
  emailVerifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type AdminUsersOrderBy =
  | "createdAt"
  | "updatedAt"
  | "username"
  | "email"
  | "role"
  | "isActive"

export interface UserSearchParams {
  page?: number
  limit?: number
  order?: "ASC" | "DESC"
  /** Si se omite, el backend aplica su orden por defecto (created_at). */
  orderBy?: AdminUsersOrderBy
  search?: string
  pagination?: boolean
}

export interface UsersPageMeta {
  page: number
  limit: number
  totalObjects: number
  totalPages: number
}

export interface UsersPageResponse {
  data: User[]
  meta: UsersPageMeta
}

