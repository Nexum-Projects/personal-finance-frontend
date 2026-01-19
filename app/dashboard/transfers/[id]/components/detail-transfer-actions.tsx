"use client"

import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeTransfer } from "@/app/actions/transfers"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Transfer } from "@/app/actions/transfers"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  transfer: Transfer
}

export function DetailTransferActions({ transfer }: Props) {
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
      router.push("/dashboard/transfers")
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
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/dashboard/transfers/${transfer.id}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          {t("transfers.actions.edit")}
        </Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleRemove}>
        <Trash2 className="mr-2 h-4 w-4" />
        {t("transfers.actions.delete")}
      </Button>
    </div>
  )
}

