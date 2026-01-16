"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { NumericField } from "@/components/inputs/rhf/numeric-field"
import { accountSchema, type AccountFormValues } from "@/app/actions/accounts/schema"
import { humanizeAccountType } from "@/utils/helpers/humanize-account-type"

type Props = {
  defaultValues?: AccountFormValues
  onSubmit: SubmitHandler<AccountFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
}

export function AccountForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
}: Props) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultValues || {
      name: "",
      accountType: undefined,
      initialBalance: undefined,
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos generales de la ${
            !isOnEdit ? "nueva" : ""
          } cuenta`}
          title="Datos generales"
        >
          <TextField
            control={form.control}
            description="El nombre debe tener entre 1 y 255 caracteres"
            label="Nombre"
            name="name"
            placeholder="Ingresa el nombre de la cuenta"
          />

          <SelectField
            control={form.control}
            description="Selecciona el tipo de cuenta"
            label="Tipo de cuenta"
            name="accountType"
            options={[
              { label: humanizeAccountType("CASH"), value: "CASH" },
              { label: humanizeAccountType("BANK"), value: "BANK" },
              { label: humanizeAccountType("SAVINGS"), value: "SAVINGS" },
              { label: humanizeAccountType("CHECKING"), value: "CHECKING" },
              { label: humanizeAccountType("CREDIT_CARD"), value: "CREDIT_CARD" },
              { label: humanizeAccountType("CREDIT"), value: "CREDIT" },
              { label: humanizeAccountType("INVESTMENT"), value: "INVESTMENT" },
              { label: humanizeAccountType("LOAN"), value: "LOAN" },
              { label: humanizeAccountType("OTHER"), value: "OTHER" },
            ]}
            placeholder="Selecciona el tipo de cuenta"
          />

          {!isOnEdit && (
            <NumericField
              control={form.control}
              decimalScale={2}
              label="Balance inicial"
              name="initialBalance"
              placeholder="0.00"
              description="Opcional. No permite valores negativos."
            />
          )}
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


