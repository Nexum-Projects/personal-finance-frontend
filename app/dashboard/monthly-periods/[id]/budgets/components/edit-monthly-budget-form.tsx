"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { updateMonthlyBudget } from "@/app/actions/monthly-budgets"
import { MonthlyBudgetForm } from "./monthly-budget-form"
import type { MonthlyBudgetFormValues } from "@/app/actions/monthly-budgets/schema"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"
import type { Category } from "@/app/actions/categories/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { centsToDecimal } from "@/utils/helpers/format-amount"

type Props = {
  budget: MonthlyBudget
  backToHref: string
  monthlyPeriodId: string
  categories: Category[]
}

export function EditMonthlyBudgetForm({
  budget,
  backToHref,
  monthlyPeriodId,
  categories,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: MonthlyBudgetFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateMonthlyBudget(budget.id, {
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
          result.errors[0] || "Error al actualizar el presupuesto"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Presupuesto actualizado", {
        description: (
          <>
            El presupuesto ha sido actualizado exitosamente.
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
    <MonthlyBudgetForm
      defaultValues={{
        monthlyPeriodId: budget.monthlyPeriod.id,
        categoryId: budget.category.id,
        budgetedAmount: centsToDecimal(budget.budgetedCents),
      }}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      monthlyPeriodId={monthlyPeriodId}
      categories={categories}
      isOnEdit
    />
  )
}

