"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeTransfer } from "@/app/actions/transfers"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Transfer } from "@/app/actions/transfers"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  transfer: Transfer
}

export function TransfersRowActions({ transfer }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()
  const { t } = useI18n()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          {t("transfers.confirmDelete.title")}{" "}
          <span className="text-foreground font-medium">{transfer.fromAccount.name}</span> →{" "}
          <span className="text-foreground font-medium">{transfer.toAccount.name}</span>.{" "}
          {t("transfers.confirmDelete.description")}
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: t("transfers.confirmDelete.confirm"),
        cancel: t("transfers.confirmDelete.cancel"),
      },
      title: t("transfers.confirmDelete.title"),
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
          result.errors[0] || t("transfers.errorDelete")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.transfer.deleted"), {
        description: t("toast.transfer.deleted.desc"),
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
        {t("transfers.actions.view")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Item href={`/dashboard/transfers/${transfer.id}/edit`} type="link">
        {t("transfers.actions.edit")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
        {t("transfers.actions.delete")}
      </DataTableRowActions.Item>
    </DataTableRowActions>
  )
}

