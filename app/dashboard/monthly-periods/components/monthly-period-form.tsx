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
import { monthlyPeriodSchema, type MonthlyPeriodFormValues } from "@/app/actions/monthly-periods/schema"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { PREFERRED_CURRENCY_LABEL } from "@/utils/user-preferences"

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
  const { t } = useI18n()
  const { locale, preferredCurrency } = useUserPreferences()
  const form = useForm<MonthlyPeriodFormValues>({
    resolver: zodResolver(monthlyPeriodSchema),
    defaultValues: defaultValues || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      initialSavingCents: 0,
    },
  })

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    label: humanizeMonth(month, locale),
    value: month.toString(),
  }))

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={
            !isOnEdit
              ? t("monthlyPeriods.form.sectionDescNew")
              : t("monthlyPeriods.form.sectionDescEdit")
          }
          title={t("monthlyPeriods.form.sectionTitle")}
        >
          <NumericField
            control={form.control}
            decimalScale={0}
            description={t("monthlyPeriods.form.year.desc")}
            label={t("monthlyPeriods.form.year.label")}
            name="year"
            placeholder="2024"
          />

          <SelectField
            control={form.control}
            description={t("monthlyPeriods.form.month.desc")}
            label={t("monthlyPeriods.form.month.label")}
            name="month"
            options={monthOptions}
            placeholder={t("monthlyPeriods.form.month.placeholder")}
            transformValue={(value) => (value ? parseInt(value, 10) : undefined)}
          />

          <NumericField
            control={form.control}
            decimalScale={2}
            description={t("monthlyPeriods.form.initialSaving.desc", {
              currency: PREFERRED_CURRENCY_LABEL[preferredCurrency],
            })}
            label={t("monthlyPeriods.form.initialSaving.label")}
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

