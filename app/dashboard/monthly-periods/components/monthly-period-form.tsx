"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { NumericField } from "@/components/inputs/rhf/numeric-field"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { monthlyPeriodSchema, type MonthlyPeriodFormValues } from "@/app/actions/monthly-periods/schema"
import { humanizeMonth } from "@/utils/helpers/humanize-month"

type Props = {
  defaultValues?: MonthlyPeriodFormValues
  onSubmit: SubmitHandler<MonthlyPeriodFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
}

export function MonthlyPeriodForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
}: Props) {
  const form = useForm<MonthlyPeriodFormValues>({
    resolver: zodResolver(monthlyPeriodSchema),
    defaultValues: defaultValues || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      initialSavingCents: 0,
    },
  })

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    label: humanizeMonth(month),
    value: month.toString(),
  }))

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos generales del ${
            !isOnEdit ? "nuevo" : ""
          } período mensual`}
          title="Datos generales"
        >
          <NumericField
            control={form.control}
            decimalScale={0}
            description="El año debe estar entre 1900 y 9999"
            label="Año"
            name="year"
            placeholder="2024"
          />

          <SelectField
            control={form.control}
            description="Selecciona el mes del período"
            label="Mes"
            name="month"
            options={monthOptions}
            placeholder="Selecciona el mes"
            transformValue={(value) => (value ? parseInt(value, 10) : undefined)}
          />

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

