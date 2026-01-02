export type UserRole = "USER" | "ADMIN"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

