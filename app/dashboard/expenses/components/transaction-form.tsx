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
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { PREFERRED_CURRENCY_LABEL } from "@/utils/user-preferences"
import { useI18n } from "@/components/i18n/i18n-provider"

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

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      amount: undefined,
      description: "",
      categoryId: "",
      accountId: "",
      transactionDate: getCurrentDateInTimeZone(),
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={
            !isOnEdit
              ? t("transactions.form.sectionDescNew")
              : t("transactions.form.sectionDescEdit")
          }
          title={t("transactions.form.sectionTitle")}
        >
          <NumericField
            control={form.control}
            decimalScale={2}
            description={t("transactions.form.amount.desc", {
              currency: PREFERRED_CURRENCY_LABEL[preferredCurrency],
            })}
            label={t("transactions.form.amount.label")}
            name="amount"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description={t("transactions.form.description.desc")}
            label={t("transactions.form.description.label")}
            name="description"
            placeholder={t("transactions.form.description.placeholder")}
          />

          <SelectField
            control={form.control}
            description={t("transactions.form.category.desc")}
            label={t("transactions.form.category.label")}
            name="categoryId"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            placeholder={t("filters.category.placeholder")}
          />

          <SelectField
            control={form.control}
            description={t("transactions.form.account.desc")}
            label={t("transactions.form.account.label")}
            name="accountId"
            options={accounts.map((account) => ({
              label: account.name,
              value: account.id,
            }))}
            placeholder={t("filters.account.placeholder")}
          />

          <TextField
            control={form.control}
            description={t("transactions.form.transactionDate.desc")}
            label={t("transactions.form.transactionDate.label")}
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

