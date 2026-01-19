"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Edit, Trash2 } from "lucide-react"
import { removeTransaction } from "@/app/actions/transactions"
import { PageHeaderActions } from "@/components/display/page-header-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import type { Transaction } from "@/app/actions/transactions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  transaction: Transaction
  categoryType: "INCOME" | "EXPENSE"
}

export function DetailTransactionActions({ transaction, categoryType }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { confirmationDialog } = useConfirmationDialogStore()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()

  const basePath = pathname.startsWith("/dashboard/transactions/")
    ? categoryType === "INCOME"
      ? "/dashboard/transactions/income"
      : "/dashboard/transactions/expenses"
    : categoryType === "INCOME"
      ? "/dashboard/income"
      : "/dashboard/expenses"

  const handleDelete = () => {
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
      onConfirm: onDelete,
      actions: {
        confirm: t("transactions.confirmDelete.confirm"),
        cancel: t("transactions.confirmDelete.cancel"),
      },
      title: t("transactions.confirmDelete.title"),
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
          result.errors[0] || t("transactions.errorDelete")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setLoading(false)
        return
      }

      toast.success(t("toast.transaction.deleted"), {
        description: (
          <>{t("toast.transaction.deleted.desc", { description: transaction.description })}</>
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
          label: t("transactions.actions.edit"),
          type: "link",
          href: `${basePath}/${transaction.id}/edit`,
        },
        delete: {
          icon: Trash2,
          isLoading: loading,
          label: t("transactions.actions.delete"),
          type: "button",
          variant: "destructive",
          onClick: handleDelete,
        },
      }}
    />
  )
}

