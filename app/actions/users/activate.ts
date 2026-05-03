"use server"

import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import getCurrentUser from "./get-current-user"
import findUser from "./find"
import type { User } from "./types"
import { normalizeUserFromApi } from "./normalize-user-from-api"
import { getServerI18n } from "@/utils/i18n/server"

export default async function activateUser(userId: string): Promise<ActionResponse<User>> {
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

    const response = await baseAxios.patch<{ data?: User }>(`/users/${userId}/activate`)

    let user =
      response.data?.data != null ? normalizeUserFromApi(response.data.data) : undefined
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
    if (isAxiosError(error) && error.response) {
      const status = error.response.status
      if (status === 401 || status === 403) {
        await handleAuthErrorServer()
      }

      const responseData = error.response.data
      const humanizedError = parseApiError(responseData)

      return {
        status: "error",
        errors: [
          {
            title: humanizedError.title,
            message: humanizedError.description,
            statusCode: status,
          },
        ],
      }
    }

    const humanizedError = parseApiError(error)
    return {
      status: "error",
      errors: [
        {
          title: humanizedError.title,
          message: humanizedError.description,
        },
      ],
    }
  }
}
