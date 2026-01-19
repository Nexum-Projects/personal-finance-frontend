import type { UserRole } from "@/app/actions/users/types"
import type { PreferredLanguage } from "@/utils/user-preferences"

const ROLE_MAP: Record<PreferredLanguage, Record<UserRole, string>> = {
  ES: { USER: "Usuario", ADMIN: "Administrador" },
  EN: { USER: "User", ADMIN: "Administrator" },
  PT: { USER: "Usuário", ADMIN: "Administrador" },
}

export function humanizeRole(role: UserRole, language: PreferredLanguage = "ES"): string {
  return ROLE_MAP[language]?.[role] || role
}

