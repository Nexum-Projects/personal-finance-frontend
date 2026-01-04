"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeTransfer } from "@/app/actions/transfers"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Transfer } from "@/app/actions/transfers"

type Props = {
  transfer: Transfer
}

export function TransfersRowActions({ transfer }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas eliminar la transferencia de{" "}
          <span className="text-foreground font-medium">{transfer.fromAccount.name}</span> a{" "}
          <span className="text-foreground font-medium">{transfer.toAccount.name}</span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, eliminar transferencia",
        cancel: "Cancelar",
      },
      title: "¿Eliminar transferencia?",
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeTransfer(transfer.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al eliminar la transferencia"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Transferencia eliminada", {
        description: "La transferencia ha sido eliminada exitosamente.",
      })
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
    }
  }

  return (
    <DataTableRowActions>
      <DataTableRowActions.Item href={`/dashboard/transfers/${transfer.id}`} type="link">
        Ver transferencia
      </DataTableRowActions.Item>
      <DataTableRowActions.Item href={`/dashboard/transfers/${transfer.id}/edit`} type="link">
        Editar transferencia
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
        Eliminar transferencia
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}

