"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeAccount } from "@/app/actions/accounts"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Account } from "@/app/actions/transactions/types"

type Props = {
  account: Account
}

export function AccountsRowActions({ account }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar la cuenta{" "}
          <span className="text-foreground font-medium">{account.name}</span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, desactivar cuenta",
        cancel: "Cancelar",
      },
      title: "¿Desactivar cuenta?",
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeAccount(account.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al desactivar la cuenta"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Cuenta desactivada", {
        description: (
          <>
            La cuenta{" "}
            <span className="text-foreground font-medium">{account.name}</span>{" "}
            ha sido desactivada exitosamente.
          </>
        ),
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
      <DataTableRowActions.Item href={`/dashboard/accounts/${account.id}`} type="link">
        Ver cuenta
      </DataTableRowActions.Item>
      <DataTableRowActions.Item href={`/dashboard/accounts/${account.id}/edit`} type="link">
        Editar cuenta
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
        Desactivar cuenta
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}


