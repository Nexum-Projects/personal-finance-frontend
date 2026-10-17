"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Transfer } from "./types"

export default async function findTransfer(
  id: string
): Promise<ActionResponse<Transfer>> {
  try {
    const response = await baseAxios.get<{ data: Transfer }>(`/transfers/${id}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error, { redirectOnAuthError: true })
  }
}
