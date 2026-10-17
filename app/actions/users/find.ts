"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { User } from "./types"
import { normalizeUserFromApi } from "./normalize-user-from-api"

export default async function findUser(
  userId: string
): Promise<ActionResponse<User>> {
  try {
    const response = await baseAxios.get<{ data: User }>(`/users/${userId}`)

    return {
      status: "success",
      data: normalizeUserFromApi(response.data.data),
    }
  } catch (error) {
    return actionError(error, {
      redirectOnAuthError: true,
      withStatusCode: true,
    })
  }
}
