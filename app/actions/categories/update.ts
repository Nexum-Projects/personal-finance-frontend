"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Category } from "./types"

export interface UpdateCategoryInput {
  name?: string
  categoryType?: "INCOME" | "EXPENSE"
}

export default async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput
): Promise<ActionResponse<Category>> {
  try {
    const response = await baseAxios.put<{ data: Category }>(
      `/categories/${categoryId}`,
      input
    )

    revalidatePath("/dashboard/categories")

    return {
      status: "success",
      data: response.data.data,
    }
  } catch (error) {
    return actionError(error)
  }
}
