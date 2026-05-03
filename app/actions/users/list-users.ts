"use server"

import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import getCurrentUser from "./get-current-user"
import type { UserSearchParams, UsersPageResponse } from "./types"
import { normalizeUserFromApi } from "./normalize-user-from-api"
import { getServerI18n } from "@/utils/i18n/server"

function normalizeUsersPageResponse(body: unknown): UsersPageResponse | null {
  if (!body || typeof body !== "object") return null
  const b = body as Record<string, unknown>
  const rawData = b.data
  const rawMeta = b.meta
  if (!Array.isArray(rawData) || !rawMeta || typeof rawMeta !== "object") return null
  const m = rawMeta as Record<string, unknown>
  const page = Number(m.page ?? 1)
  const limit = Number(m.limit ?? 10)
  const totalObjects = Number(m.totalObjects ?? m.total ?? 0)
  const totalPages =
    Number(m.totalPages) ||
    (limit > 0 ? Math.max(1, Math.ceil(totalObjects / limit)) : 1)
  return {
    data: rawData as UsersPageResponse["data"],
    meta: {
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 10,
      totalObjects: Number.isFinite(totalObjects) ? totalObjects : 0,
      totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    },
  }
}

export default async function listUsers(
  params: UserSearchParams
): Promise<ActionResponse<UsersPageResponse>> {
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

    const queryParams = new URLSearchParams()

    if (params.page != null) {
      queryParams.append("page", params.page.toString())
    }
    if (params.limit != null) {
      queryParams.append("limit", params.limit.toString())
    }
    if (params.order) {
      queryParams.append("order", params.order)
    }
    if (params.orderBy) {
      queryParams.append("orderBy", params.orderBy)
    }
    if (params.search) {
      queryParams.append("search", params.search)
    }
    if (params.pagination !== undefined) {
      queryParams.append("pagination", String(params.pagination))
    }

    const qs = queryParams.toString()
    const response = await baseAxios.get<unknown>(qs ? `/users?${qs}` : "/users")

    const normalized = normalizeUsersPageResponse(response.data)
    if (!normalized) {
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
      data: {
        ...normalized,
        data: normalized.data.map((u) => normalizeUserFromApi(u)),
      },
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
