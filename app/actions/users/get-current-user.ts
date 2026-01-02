"use server"

import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import getSession from "../auth/getSession"
import type { User } from "./types"

function isUuid(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    value
  )
}

function readStringClaim(session: Record<string, unknown>, key: string): string | null {
  const val = session[key]
  if (typeof val !== "string") return null
  const trimmed = val.trim()
  return trimmed.length ? trimmed : null
}

/**
 * Obtiene el usuario actual logueado.
 * Nota: el backend expone `GET /users/:id`, así que necesitamos que el JWT contenga el UUID del usuario
 * (en `id`, `userId`, etc). Si `sub` no es UUID (por ejemplo username/email), NO se usa.
 */
export default async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  // `getSession()` retorna un payload con index signature, pero lo normalizamos para leer claims.
  const claims = session as Record<string, unknown>

  // 1) Preferir claims explícitos que típicamente son UUID
  const preferredIdFields = ["jti","id", "userId", "user_id", "user-id", "uid", "userUuid", "user_uuid"]
  for (const field of preferredIdFields) {
    const candidate = readStringClaim(claims, field)
    if (candidate && isUuid(candidate)) {
      return await fetchUser(candidate)
    }
  }

  // 2) `sub` solo si es UUID
  const sub = readStringClaim(claims, "sub")
  if (sub && isUuid(sub)) {
    return await fetchUser(sub)
  }

  // No tenemos UUID del usuario en el token → no podemos llamar /users/:id
  return null
}

async function fetchUser(userId: string): Promise<User | null> {
  try {
    const response = await baseAxios.get<{ data: User }>(`/users/${userId}`)
    return response.data.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status
      if (status === 401 || status === 403) {
        await handleAuthErrorServer()
      }
    }
    return null
  }
}


