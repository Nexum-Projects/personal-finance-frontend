"use server"

import { isAxiosError } from "axios"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { changePasswordSchema, type ChangePasswordFormValues } from "./change-password-schema"

export default async function changePassword(
  input: ChangePasswordFormValues
): ActionResponse<null> {
  try {
    const validated = changePasswordSchema.parse(input)

    await baseAxios.post("/auth/change-password", {
      currentPassword: validated.currentPassword,
      newPassword: validated.newPassword,
    })

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const responseData = error.response.data
      const humanizedError = parseApiError(responseData)

      return {
        status: "error",
        errors: [
          {
            title: humanizedError.title,
            message: humanizedError.description,
            statusCode: error.response.status,
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


