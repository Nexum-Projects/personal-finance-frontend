"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createTransfer } from "@/app/actions/transfers"
import { TransferForm } from "./transfer-form"
import type { TransferFormValues } from "@/app/actions/transfers/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Account } from "@/app/actions/transactions/types"

type Props = {
  accounts: Account[]
  backToHref: string
}

export function NewTransferForm({ accounts, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: TransferFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createTransfer(formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al crear la transferencia"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Transferencia creada", {
        description: "La transferencia ha sido creada exitosamente",
      })

      router.push("/dashboard/transfers")
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <TransferForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      accounts={accounts}
    />
  )
}

