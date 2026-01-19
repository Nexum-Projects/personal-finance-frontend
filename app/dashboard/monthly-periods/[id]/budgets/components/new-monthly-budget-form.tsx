"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createMonthlyBudget } from "@/app/actions/monthly-budgets"
import { MonthlyBudgetForm } from "./monthly-budget-form"
import type { MonthlyBudgetFormValues } from "@/app/actions/monthly-budgets/schema"
import type { Category } from "@/app/actions/categories/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  backToHref: string
  monthlyPeriodId: string
  categories: Category[]
}

export function NewMonthlyBudgetForm({ backToHref, monthlyPeriodId, categories }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  const onSubmit = async (formValues: MonthlyBudgetFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createMonthlyBudget({
        ...formValues,
        monthlyPeriodId,
      })

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.budgets.errorCreate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.monthlyBudget.created"), {
        description: (
          <>{t("toast.monthlyBudget.created.desc")}</>
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
    <MonthlyBudgetForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      monthlyPeriodId={monthlyPeriodId}
      categories={categories}
    />
  )
}

