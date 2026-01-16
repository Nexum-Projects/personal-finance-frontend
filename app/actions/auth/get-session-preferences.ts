"use server"

import getSession from "./getSession"
import { getPreferencesFromClaims, type UserPreferences } from "@/utils/user-preferences"

export default async function getSessionPreferences(): Promise<UserPreferences> {
  const session = await getSession()
  return getPreferencesFromClaims(session as Record<string, unknown> | null)
}

