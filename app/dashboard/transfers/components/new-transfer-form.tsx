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
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  accounts: Account[]
  backToHref: string
}

export function NewTransferForm({ accounts, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

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
          result.errors[0] || t("transfers.errorCreate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.transfer.created"), {
        description: t("toast.transfer.created.desc"),
      })

      router.push(backToHref)
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

