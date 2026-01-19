"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { removeTransaction } from "@/app/actions/transactions"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Transaction } from "@/app/actions/transactions/types"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  transaction: Transaction
  categoryType: "INCOME" | "EXPENSE"
  basePath: string
}

export function TransactionsRowActions({ transaction, categoryType, basePath }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()
  const { t } = useI18n()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          {t("transactions.confirmDelete.title")}{" "}
          <span className="text-foreground font-medium">
            {transaction.description}
          </span>
          ? {t("transactions.confirmDelete.description")}
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: t("transactions.confirmDelete.confirm"),
        cancel: t("transactions.confirmDelete.cancel"),
      },
      title: t("transactions.confirmDelete.title"),
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeTransaction(transaction.id, categoryType)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("transactions.errorDelete")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.transaction.deleted"), {
        description: (
          <>
            {t("toast.transaction.deleted.desc", { description: transaction.description })}
          </>
        ),
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
        href={`${basePath}/${transaction.id}`}
        type="link"
      >
        {t("transactions.actions.view")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Item
        href={`${basePath}/${transaction.id}/edit`}
        type="link"
      >
        {t("transactions.actions.edit")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item
        type="button"
        variant="destructive"
        onClick={handleRemove}
      >
        {t("transactions.actions.delete")}
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}

