"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Account } from "../transactions/types"
import type { AccountFormValues } from "./schema"

export default async function createAccount(
  input: AccountFormValues
): Promise<ActionResponse<Account>> {
  try {
    // Convertir el balance inicial a centavos
    // Si es undefined o null, usar 0
    const initialBalance = input.initialBalance ?? 0
    const initialBalanceCents = Math.round(initialBalance * 100)

    const response = await baseAxios.post<{ data: Account }>("/accounts", {
      name: input.name,
      accountType: input.accountType,
      initialBalanceCents,
    })

    revalidatePath("/dashboard/accounts")

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
