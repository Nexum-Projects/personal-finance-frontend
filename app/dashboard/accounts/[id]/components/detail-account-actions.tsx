"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
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

  const handleDeactivate = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar la cuenta{" "}
          <span className="text-foreground font-medium">{account.name}</span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onDeactivate,
      actions: {
        confirm: "Sí, desactivar cuenta",
        cancel: "Cancelar",
      },
      title: "¿Desactivar cuenta?",
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

      toast.success("Cuenta desactivada", {
        description: (
          <>
            La cuenta{" "}
            <span className="text-foreground font-medium">{account.name}</span>{" "}
            ha sido desactivada exitosamente.
          </>
        ),
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
          label: "Editar cuenta",
          type: "link",
          href: `/dashboard/accounts/${account.id}/edit`,
        },
        deactivate: {
          icon: Trash2,
          isLoading: loading,
          label: "Desactivar cuenta",
          type: "button",
          variant: "destructive",
          onClick: handleDeactivate,
        },
      }}
    />
  )
}


