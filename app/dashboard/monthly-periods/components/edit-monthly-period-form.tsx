"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateMonthlyPeriod } from "@/app/actions/monthly-periods"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { NumericField } from "@/components/inputs/rhf/numeric-field"
import { monthlyPeriodUpdateSchema, type MonthlyPeriodUpdateFormValues } from "@/app/actions/monthly-periods/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  defaultValues: MonthlyPeriodUpdateFormValues
  monthlyPeriodId: string
  backToHref: string
}

export function EditMonthlyPeriodForm({
  defaultValues,
  monthlyPeriodId,
  backToHref,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<MonthlyPeriodUpdateFormValues>({
    resolver: zodResolver(monthlyPeriodUpdateSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<MonthlyPeriodUpdateFormValues> = async (formValues) => {
    setIsSubmitting(true)

    try {
      // Convertir de decimales a centavos antes de enviar
      const result = await updateMonthlyPeriod(monthlyPeriodId, {
        initialSavingCents: Math.round(formValues.initialSavingCents * 100),
      })

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
        description: "La meta de ahorro ha sido actualizada exitosamente.",
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
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description="Actualiza el ahorro inicial para este presupuesto mensual"
          title="Ahorro Inicial"
        >
          <NumericField
            control={form.control}
            decimalScale={2}
            description="Ingresa el ahorro inicial para este período (en quetzales)"
            label="Ahorro Inicial"
            name="initialSavingCents"
            placeholder="0.00"
          />
        </FormSection>

        <div className="flex flex-row-reverse items-center justify-start gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar
          </Button>
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={backToHref}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

