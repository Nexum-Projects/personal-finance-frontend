"use server"

import { isAxiosError } from "axios"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { userUpdateSchema, type UserUpdateFormValues } from "./schema"

export default async function updateUser(
  input: UserUpdateFormValues
): ActionResponse<null> {
  try {
    const validated = userUpdateSchema.parse(input)

    await baseAxios.put("/users", {
      username: validated.username,
      preferredCurrency: validated.preferredCurrency,
      timeZone: validated.timeZone,
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


