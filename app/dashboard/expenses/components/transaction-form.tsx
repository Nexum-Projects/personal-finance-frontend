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
import { transactionSchema, type TransactionFormValues } from "@/app/actions/transactions/schema"
import type { Category } from "@/app/actions/transactions/types"
import type { Account } from "@/app/actions/transactions/types"

type Props = {
  defaultValues?: TransactionFormValues
  onSubmit: SubmitHandler<TransactionFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
  categories: Category[]
  accounts: Account[]
}

export function TransactionForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
  categories,
  accounts,
}: Props) {
  // Obtener fecha actual en zona horaria de Guatemala
  const getCurrentDateInGuatemala = (): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Guatemala",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    return formatter.format(new Date())
  }

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      amount: undefined,
      description: "",
      categoryId: "",
      accountId: "",
      transactionDate: getCurrentDateInGuatemala(),
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos generales de la ${
            !isOnEdit ? "nueva" : ""
          } transacción`}
          title="Datos generales"
        >
          <NumericField
            control={form.control}
            decimalScale={2}
            description="Ingresa el monto de la transacción (debe ser mayor a 0)"
            label="Monto"
            name="amount"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description="La descripción debe tener entre 1 y 255 caracteres"
            label="Descripción"
            name="description"
            placeholder="Ingresa la descripción de la transacción"
          />

          <SelectField
            control={form.control}
            description="Selecciona la categoría de la transacción"
            label="Categoría"
            name="categoryId"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            placeholder="Selecciona una categoría"
          />

          <SelectField
            control={form.control}
            description="Selecciona la cuenta de la transacción"
            label="Cuenta"
            name="accountId"
            options={accounts.map((account) => ({
              label: account.name,
              value: account.id,
            }))}
            placeholder="Selecciona una cuenta"
          />

          <TextField
            control={form.control}
            description="Selecciona la fecha de la transacción"
            label="Fecha de Transacción"
            name="transactionDate"
            type="date"
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

