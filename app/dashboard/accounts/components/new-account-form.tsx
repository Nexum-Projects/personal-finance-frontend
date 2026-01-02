"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createAccount } from "@/app/actions/accounts"
import { AccountForm } from "./account-form"
import type { AccountFormValues } from "@/app/actions/accounts/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  backToHref: string
}

export function NewAccountForm({ backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: AccountFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createAccount(formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al crear la cuenta"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Cuenta creada", {
        description: (
          <>
            La cuenta{" "}
            <span className="text-foreground font-medium">
              {result.data.name}
            </span>{" "}
            ha sido creada exitosamente.
          </>
        ),
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
    <AccountForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
    />
  )
}


