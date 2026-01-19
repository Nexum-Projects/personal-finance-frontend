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
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { useI18n } from "@/components/i18n/i18n-provider"

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
  const { preferredLanguage } = useUserPreferences()
  const { t } = useI18n()
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
          description={
            isOnEdit ? t("accounts.form.sectionDescEdit") : t("accounts.form.sectionDescNew")
          }
          title={t("accounts.form.sectionTitle")}
        >
          <TextField
            control={form.control}
            description={t("accounts.form.name.desc")}
            label={t("accounts.form.name.label")}
            name="name"
            placeholder={t("accounts.form.name.placeholder")}
          />

          <SelectField
            control={form.control}
            description={t("accounts.form.type.desc")}
            label={t("accounts.form.type.label")}
            name="accountType"
            options={[
              { label: humanizeAccountType("CASH", preferredLanguage), value: "CASH" },
              { label: humanizeAccountType("BANK", preferredLanguage), value: "BANK" },
              { label: humanizeAccountType("SAVINGS", preferredLanguage), value: "SAVINGS" },
              { label: humanizeAccountType("CHECKING", preferredLanguage), value: "CHECKING" },
              { label: humanizeAccountType("CREDIT_CARD", preferredLanguage), value: "CREDIT_CARD" },
              { label: humanizeAccountType("CREDIT", preferredLanguage), value: "CREDIT" },
              { label: humanizeAccountType("INVESTMENT", preferredLanguage), value: "INVESTMENT" },
              { label: humanizeAccountType("LOAN", preferredLanguage), value: "LOAN" },
              { label: humanizeAccountType("OTHER", preferredLanguage), value: "OTHER" },
            ]}
            placeholder={t("accounts.form.type.placeholder")}
          />

          {!isOnEdit && (
            <NumericField
              control={form.control}
              decimalScale={2}
              label={t("accounts.form.initialBalance.label")}
              name="initialBalance"
              placeholder="0.00"
              description={t("accounts.form.initialBalance.desc")}
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


