"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Edit, Trash2 } from "lucide-react"
import { removeTransaction } from "@/app/actions/transactions"
import { PageHeaderActions } from "@/components/display/page-header-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import type { Transaction } from "@/app/actions/transactions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  transaction: Transaction
  categoryType: "INCOME" | "EXPENSE"
}

export function DetailTransactionActions({ transaction, categoryType }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { confirmationDialog } = useConfirmationDialogStore()
  const router = useRouter()

  const basePath = categoryType === "INCOME" ? "/dashboard/income" : "/dashboard/expenses"

  const handleDelete = () => {
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
      onConfirm: onDelete,
      actions: {
        confirm: "Sí, eliminar transacción",
        cancel: "Cancelar",
      },
      title: "¿Eliminar transacción?",
    })
  }

  const onDelete = async () => {
    setLoading(true)

    try {
      const result = await removeTransaction(transaction.id, categoryType)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setLoading(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al eliminar la transacción"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setLoading(false)
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

      router.push(basePath)
      router.refresh()
    } catch (error) {
      // Manejar errores de autenticación
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setLoading(false)
    }
  }

  return (
    <PageHeaderActions
      actions={{
        edit: {
          icon: Edit,
          isLoading: loading,
          label: "Editar transacción",
          type: "link",
          href: `${basePath}/${transaction.id}/edit`,
        },
        delete: {
          icon: Trash2,
          isLoading: loading,
          label: "Eliminar transacción",
          type: "button",
          variant: "destructive",
          onClick: handleDelete,
        },
      }}
    />
  )
}

