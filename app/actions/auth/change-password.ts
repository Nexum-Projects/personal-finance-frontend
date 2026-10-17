"use server"

import { actionError } from "@/app/actions/helpers/action-error"

import baseAxios from "../baseAxios"
import type { ActionResponse } from "../types"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "./change-password-schema"

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
    return actionError(error, { withStatusCode: true })
  }
}
