"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { NumericField } from "@/components/inputs/rhf/numeric-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { monthlyBudgetSchema, type MonthlyBudgetFormValues } from "@/app/actions/monthly-budgets/schema"
import type { Category } from "@/app/actions/categories/types"
import { centsToDecimal } from "@/utils/helpers/format-amount"

type Props = {
  defaultValues?: MonthlyBudgetFormValues
  onSubmit: SubmitHandler<MonthlyBudgetFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
  monthlyPeriodId: string
  categories: Category[]
}

export function MonthlyBudgetForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
  monthlyPeriodId,
  categories,
}: Props) {
  const form = useForm<MonthlyBudgetFormValues>({
    resolver: zodResolver(monthlyBudgetSchema),
    defaultValues: defaultValues || {
      monthlyPeriodId,
      categoryId: undefined,
      budgetedAmount: undefined,
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos del ${
            !isOnEdit ? "nuevo" : ""
          } presupuesto mensual`}
          title="Datos del presupuesto"
        >
          <SelectField
            control={form.control}
            description="Selecciona la categoría para el presupuesto"
            label="Categoría"
            name="categoryId"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            placeholder="Selecciona una categoría"
          />

          <NumericField
            control={form.control}
            decimalScale={2}
            description="Ingresa el monto presupuestado (debe ser mayor a 0)"
            label="Monto Presupuestado"
            name="budgetedAmount"
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

