"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import baseAxios from "../baseAxios"
import { ActionResponse } from "../types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
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
    if (isAxiosError(error) && error.response) {
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

