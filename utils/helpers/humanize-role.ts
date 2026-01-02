import type { UserRole } from "@/app/actions/users/types"

export function humanizeRole(role: UserRole): string {
  const ROLE_MAP: Record<UserRole, string> = {
    USER: "Usuario",
    ADMIN: "Administrador",
  }

  return ROLE_MAP[role] || role
}

