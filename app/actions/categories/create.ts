"use server"

import { actionError } from "@/app/actions/helpers/action-error"
import { revalidatePath } from "next/cache"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import type { Category } from "./types"

export interface CreateCategoryInput {
  name: string
  categoryType: "INCOME" | "EXPENSE"
}

export default async function createCategory(
  input: CreateCategoryInput
): Promise<ActionResponse<Category>> {
  try {
    const response = await baseAxios.post<{ data: Category }>(
      "/categories",
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
