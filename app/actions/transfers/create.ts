"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthErrorServer } from "../helpers/handle-auth-error-server"
import type { Transfer } from "./types"
import type { TransferFormValues } from "./schema"

export default async function createTransfer(
  input: TransferFormValues
): Promise<ActionResponse<Transfer>> {
  try {
    // Convertir el monto de decimales a centavos
    const amountCents = Math.round(input.amountCents * 100)

    const response = await baseAxios.post<{ data: Transfer }>(
      "/transfers",
      {
        amountCents,
        description: input.description,
        transferDate: input.transferDate,
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
      }
    )

    revalidatePath("/dashboard/transfers")

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

