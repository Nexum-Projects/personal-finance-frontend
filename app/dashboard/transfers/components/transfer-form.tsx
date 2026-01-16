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
import { transferSchema, type TransferFormValues } from "@/app/actions/transfers/schema"
import type { Account } from "@/app/actions/transactions/types"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { PREFERRED_CURRENCY_LABEL } from "@/utils/user-preferences"

type Props = {
  defaultValues?: TransferFormValues
  onSubmit: SubmitHandler<TransferFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
  accounts: Account[]
}

export function TransferForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
  accounts,
}: Props) {
  const { preferredCurrency, timeZoneIana } = useUserPreferences()

  // Obtener fecha actual en zona horaria configurada
  const getCurrentDateInTimeZone = (): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZoneIana,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    return formatter.format(new Date())
  }

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: defaultValues || {
      amountCents: undefined,
      description: "",
      transferDate: getCurrentDateInTimeZone(),
      fromAccountId: "",
      toAccountId: "",
    },
  })

  const accountOptions = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const fromAccountId = form.watch("fromAccountId")
  const toAccountId = form.watch("toAccountId")

  // Filtrar cuentas de destino para excluir la cuenta de origen
  const toAccountOptions = accountOptions.filter(
    (option) => option.value !== fromAccountId
  )

  // Filtrar cuentas de origen para excluir la cuenta de destino
  const fromAccountOptions = accountOptions.filter(
    (option) => option.value !== toAccountId
  )

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos de la ${
            !isOnEdit ? "nueva" : ""
          } transferencia`}
          title="Datos de la transferencia"
        >
          <SelectField
            control={form.control}
            description="Selecciona la cuenta de origen"
            label="Cuenta de Origen"
            name="fromAccountId"
            options={fromAccountOptions}
            placeholder="Selecciona la cuenta de origen"
            transformValue={(value) => (value ? value : undefined)}
          />

          <SelectField
            control={form.control}
            description="Selecciona la cuenta de destino"
            label="Cuenta de Destino"
            name="toAccountId"
            options={toAccountOptions}
            placeholder="Selecciona la cuenta de destino"
            transformValue={(value) => (value ? value : undefined)}
          />

          <NumericField
            control={form.control}
            decimalScale={2}
            description={`Ingresa el monto a transferir (en ${PREFERRED_CURRENCY_LABEL[preferredCurrency]})`}
            label="Monto"
            name="amountCents"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description="Describe el propósito de la transferencia"
            label="Descripción"
            name="description"
            placeholder="Ingresa una descripción"
            type="text"
          />

          <TextField
            control={form.control}
            description="Fecha en que se realiza la transferencia"
            label="Fecha de Transferencia"
            name="transferDate"
            placeholder="YYYY-MM-DD"
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

