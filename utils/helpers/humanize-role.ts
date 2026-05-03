import type { UserRole } from "@/app/actions/users/types"
import type { PreferredLanguage } from "@/utils/user-preferences"

const ROLE_MAP: Record<PreferredLanguage, Record<UserRole, string>> = {
  ES: { USER: "Usuario", ADMIN: "Administrador", SYSADMIN: "Super administrador" },
  EN: { USER: "User", ADMIN: "Administrator", SYSADMIN: "Super administrator" },
  PT: { USER: "Usuário", ADMIN: "Administrador", SYSADMIN: "Super administrador" },
}

export function humanizeRole(role: UserRole, language: PreferredLanguage = "ES"): string {
  return ROLE_MAP[language]?.[role] || role
}

