"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import type { Transfer } from "./types"
import type { TransferUpdateFormValues } from "./schema"

export default async function updateTransfer(
  transferId: string,
  input: TransferUpdateFormValues
): Promise<ActionResponse<Transfer>> {
  try {
    const payload: {
      amountCents?: number
      description?: string
    } = {}

    if (input.amountCents !== undefined) {
      payload.amountCents = Math.round(input.amountCents * 100)
    }
    if (input.description !== undefined) {
      payload.description = input.description
    }

    const response = await baseAxios.put<{ data: Transfer }>(
      `/transfers/${transferId}`,
      payload
    )

    revalidatePath("/dashboard/transfers")
    revalidatePath(`/dashboard/transfers/${transferId}`)

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status

      // Manejar errores de autenticación
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

