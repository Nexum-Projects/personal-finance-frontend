"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createCategory } from "@/app/actions/categories"
import { CategoryForm } from "./category-form"
import type { CategoryFormValues } from "@/app/actions/categories/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  backToHref: string
}

export function NewCategoryForm({ backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  const onSubmit = async (formValues: CategoryFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createCategory(formValues)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al crear la categoría"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.category.created"), {
        description: t("toast.category.created.desc", { name: result.data.name }),
      })

      router.push(backToHref)
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
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
    />
  )
}

