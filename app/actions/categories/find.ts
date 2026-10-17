"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Category } from "./types"

export default async function findCategory(
  categoryId: string
): Promise<ActionResponse<Category>> {
  try {
    const response = await baseAxios.get<{ data: Category }>(
      `/categories/${categoryId}`
    )

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
