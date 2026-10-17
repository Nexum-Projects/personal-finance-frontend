"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/components/i18n/i18n-provider"
import { updateAccount } from "@/app/actions/accounts"
import { AccountForm } from "../../components/account-form"
import type { AccountFormValues } from "@/app/actions/accounts/schema"
import type { Account } from "@/app/actions/transactions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  account: Account
  backToHref: string
}

export function EditAccountForm({ account, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  const onSubmit = async (formValues: AccountFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateAccount(account.id, formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(result.errors[0])
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.account.updated"), {
        description: t("toast.account.updated.desc"),
      })

      router.push("/dashboard/accounts")
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
    <AccountForm
      defaultValues={{
        name: account.name,
        accountType: account.accountType,
      }}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      isOnEdit
    />
  )
}
