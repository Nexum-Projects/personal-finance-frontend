import type { User } from "./types"

/**
 * Unifica `emailVerifiedAt` / `email_verified_at` y valores vacíos → null.
 */
export function normalizeUserFromApi(raw: unknown): User {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid user payload")
  }
  const r = raw as Record<string, unknown>
  const v = r.emailVerifiedAt ?? r.email_verified_at
  const emailVerifiedAt =
    v === undefined || v === null || v === "" ? null : String(v)

  return {
    ...(raw as User),
    emailVerifiedAt,
  }
}
