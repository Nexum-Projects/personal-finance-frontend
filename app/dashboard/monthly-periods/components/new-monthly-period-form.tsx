"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createMonthlyPeriod } from "@/app/actions/monthly-periods"
import { MonthlyPeriodForm } from "./monthly-period-form"
import type { MonthlyPeriodFormValues } from "@/app/actions/monthly-periods/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  backToHref: string
}

export function NewMonthlyPeriodForm({ backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  const onSubmit = async (formValues: MonthlyPeriodFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createMonthlyPeriod(formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.errorCreate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.monthlyPeriod.created"), {
        description: (
          <>{t("toast.monthlyPeriod.created.desc")}</>
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
    <MonthlyPeriodForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
    />
  )
}

