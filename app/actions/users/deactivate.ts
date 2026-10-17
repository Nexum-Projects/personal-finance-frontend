"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import getCurrentUser from "./get-current-user"
import findUser from "./find"
import type { User } from "./types"
import { normalizeUserFromApi } from "./normalize-user-from-api"
import { getServerI18n } from "@/utils/i18n/server"

export default async function deactivateUser(
  userId: string
): Promise<ActionResponse<User>> {
  try {
    const [{ t }, me] = await Promise.all([getServerI18n(), getCurrentUser()])
    if (!me || me.role !== "SYSADMIN") {
      return {
        status: "error",
        errors: [
          {
            title: t("admin.error.forbidden.title"),
            message: t("admin.error.forbidden.message"),
          },
        ],
      }
    }

    const response = await baseAxios.patch<{ data?: User }>(
      `/users/${userId}/deactivate`
    )

    let user =
      response.data?.data != null
        ? normalizeUserFromApi(response.data.data)
        : undefined
    if (!user) {
      const again = await findUser(userId)
      if (again.status === "success") {
        user = again.data
      }
    }

    if (!user) {
      return {
        status: "error",
        errors: [
          {
            title: t("admin.error.invalid.title"),
            message: t("admin.error.invalid.message"),
          },
        ],
      }
    }

    return {
      status: "success",
      data: user,
    }
  } catch (error) {
    return actionError(error, {
      redirectOnAuthError: true,
      withStatusCode: true,
    })
  }
}
