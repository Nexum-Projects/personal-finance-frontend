"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { updateCategory } from "@/app/actions/categories"
import { CategoryForm } from "../../components/category-form"
import type { CategoryFormValues } from "@/app/actions/categories/schema"
import type { Category } from "@/app/actions/categories/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  category: Category
  backToHref: string
}

export function EditCategoryForm({ category, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: CategoryFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateCategory(category.id, formValues)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al actualizar la categoría"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Categoría actualizada", {
        description: "La categoría ha sido actualizada exitosamente",
      })

      router.push("/dashboard/categories")
      router.refresh()
    } catch (error) {
      // Manejar errores de autenticación
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <CategoryForm
      defaultValues={{
        name: category.name,
        categoryType: category.categoryType,
      }}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      isOnEdit
    />
  )
}

