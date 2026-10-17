"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Edit, Trash2 } from "lucide-react"
import { removeAccount } from "@/app/actions/accounts"
import { PageHeaderActions } from "@/components/display/page-header-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import type { Account } from "@/app/actions/transactions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  account: Account
}

export function DetailAccountActions({ account }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { confirmationDialog } = useConfirmationDialogStore()
  const router = useRouter()
  const { t } = useI18n()

  const handleDeactivate = () => {
    confirmationDialog({
      description: t("accounts.confirmDeactivate.desc", { name: account.name }),
      onConfirm: onDeactivate,
      actions: {
        confirm: t("accounts.confirmDeactivate.confirm"),
        cancel: t("accounts.confirmDeactivate.cancel"),
      },
      title: t("accounts.confirmDeactivate.title"),
    })
  }

  const onDeactivate = async () => {
    setLoading(true)

    try {
      const result = await removeAccount(account.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setLoading(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al desactivar la cuenta"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setLoading(false)
        return
      }

      toast.success(t("toast.account.deactivated"), {
        description: t("toast.account.deactivated.desc", {
          name: account.name,
        }),
      })

      router.push("/dashboard/accounts")
      router.refresh()
    } catch (error) {
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
          label: t("accounts.actions.edit"),
          type: "link",
          href: `/dashboard/accounts/${account.id}/edit`,
        },
        deactivate: {
          icon: Trash2,
          isLoading: loading,
          label: t("accounts.actions.deactivate"),
          type: "button",
          variant: "destructive",
          onClick: handleDeactivate,
        },
      }}
    />
  )
}
