"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { removeCategory } from "@/app/actions/categories"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Category } from "@/app/actions/categories/types"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  category: Category
}

export function CategoriesRowActions({ category }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()
  const { t } = useI18n()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar la categoría{" "}
          <span className="text-foreground font-medium">
            {category.name}
          </span>
          ? Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: t("categories.confirmDeactivate.confirm"),
        cancel: t("categories.confirmDeactivate.cancel"),
      },
      title: t("categories.confirmDeactivate.title"),
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeCategory(category.id)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al desactivar la categoría"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.category.deactivated"), {
        description: t("toast.category.deactivated.desc", { name: category.name }),
      })
      router.refresh()
    } catch (error) {
      // Manejar errores de autenticación
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
    }
  }

  return (
    <DataTableRowActions>
      <DataTableRowActions.Item
        href={`/dashboard/categories/${category.id}`}
        type="link"
      >
        {t("categories.actions.view")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Item
        href={`/dashboard/categories/${category.id}/edit`}
        type="link"
      >
        {t("categories.actions.edit")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item
        type="button"
        variant="destructive"
        onClick={handleRemove}
      >
        {t("categories.actions.deactivate")}
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}

