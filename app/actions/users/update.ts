"use server"

import { actionError } from "@/app/actions/helpers/action-error"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
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
      preferredLanguage: validated.preferredLanguage,
    })

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    return actionError(error, { withStatusCode: true })
  }
}
