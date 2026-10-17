"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"

export default async function removeCategory(
  categoryId: string
): Promise<ActionResponse<null>> {
  try {
    await baseAxios.delete(`/categories/${categoryId}`)

    revalidatePath("/dashboard/categories")

    return {
      status: "success",
      data: null,
    }
  } catch (error) {
    return actionError(error)
  }
}
