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
import { useI18n } from "@/components/i18n/i18n-provider"

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
  const { t } = useI18n()

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
          description={
            !isOnEdit ? t("transfers.form.sectionDescNew") : t("transfers.form.sectionDescEdit")
          }
          title={t("transfers.form.sectionTitle")}
        >
          <SelectField
            control={form.control}
            description={t("transfers.form.fromAccount.desc")}
            label={t("transfers.form.fromAccount.label")}
            name="fromAccountId"
            options={fromAccountOptions}
            placeholder={t("transfers.form.fromAccount.placeholder")}
            transformValue={(value) => (value ? value : undefined)}
          />

          <SelectField
            control={form.control}
            description={t("transfers.form.toAccount.desc")}
            label={t("transfers.form.toAccount.label")}
            name="toAccountId"
            options={toAccountOptions}
            placeholder={t("transfers.form.toAccount.placeholder")}
            transformValue={(value) => (value ? value : undefined)}
          />

          <NumericField
            control={form.control}
            decimalScale={2}
            description={t("transfers.form.amount.desc", {
              currency: PREFERRED_CURRENCY_LABEL[preferredCurrency],
            })}
            label={t("transfers.form.amount.label")}
            name="amountCents"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description={t("transfers.form.description.desc")}
            label={t("transfers.form.description.label")}
            name="description"
            placeholder={t("transfers.form.description.placeholder")}
            type="text"
          />

          <TextField
            control={form.control}
            description={t("transfers.form.transferDate.desc")}
            label={t("transfers.form.transferDate.label")}
            name="transferDate"
            placeholder={t("transfers.form.transferDate.placeholder")}
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
            {t("common.save")}
          </Button>
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={backToHref}>{t("common.cancel")}</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

