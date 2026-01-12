"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { updateMonthlyPeriod } from "@/app/actions/monthly-periods"
import { MonthlyPeriodForm } from "../../components/monthly-period-form"
import type { MonthlyPeriodFormValues } from "@/app/actions/monthly-periods/schema"
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  monthlyPeriod: MonthlyPeriod
  backToHref: string
}

export function EditMonthlyPeriodForm({ monthlyPeriod, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: MonthlyPeriodFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateMonthlyPeriod(monthlyPeriod.id, formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al actualizar el presupuesto mensual"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Presupuesto mensual actualizado", {
        description: (
          <>
            El presupuesto mensual ha sido actualizado exitosamente.
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
    <MonthlyPeriodForm
      defaultValues={{
        year: monthlyPeriod.year,
        month: monthlyPeriod.month,
      }}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      isOnEdit
    />
  )
}

