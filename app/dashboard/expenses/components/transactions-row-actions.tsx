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

type Props = {
  transaction: Transaction
  categoryType: "INCOME" | "EXPENSE"
  basePath: string
}

export function TransactionsRowActions({ transaction, categoryType, basePath }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas eliminar la transacción{" "}
          <span className="text-foreground font-medium">
            {transaction.description}
          </span>
          ? Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, eliminar transacción",
        cancel: "Cancelar",
      },
      title: "¿Eliminar transacción?",
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
          result.errors[0] || "Error al eliminar la transacción"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Transacción eliminada", {
        description: (
          <>
            La transacción{" "}
            <span className="text-foreground font-medium">
              {transaction.description}
            </span>{" "}
            ha sido eliminada exitosamente.
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
        Ver transacción
      </DataTableRowActions.Item>
      <DataTableRowActions.Item
        href={`${basePath}/${transaction.id}/edit`}
        type="link"
      >
        Editar transacción
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item
        type="button"
        variant="destructive"
        onClick={handleRemove}
      >
        Eliminar transacción
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}

