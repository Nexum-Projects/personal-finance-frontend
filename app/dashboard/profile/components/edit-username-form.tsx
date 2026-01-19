"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { SearchableSelectField } from "@/components/inputs/rhf/searchable-select-field"
import { updateUser } from "@/app/actions/users"
import { userUpdateSchema, type UserUpdateFormValues } from "@/app/actions/users/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"
import {
  PREFERRED_CURRENCIES,
  PREFERRED_CURRENCY_LABEL,
  PREFERRED_LANGUAGES,
  PREFERRED_LANGUAGE_LABEL,
  TIME_ZONES,
  TIME_ZONE_TO_IANA,
} from "@/utils/user-preferences"

type Props = {
  defaultValues: UserUpdateFormValues
  backToHref: string
}

export function EditUsernameForm({ defaultValues, backToHref }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useI18n()

  const form = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<UserUpdateFormValues> = async (formValues) => {
    setIsSubmitting(true)
    try {
      const result = await updateUser(formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) return

        const humanizedError = parseApiError(result.errors[0] || t("profile.edit.error.updateUser"))
        toast.error(humanizedError.title, { description: humanizedError.description })
        return
      }

      toast.success(t("profile.edit.toast.updated.title"), {
        description: t("profile.edit.toast.updated.description"),
      })

      // Cerrar sesión para que el usuario vuelva a iniciar sesión y reciba un JWT nuevo
      // con los claims actualizados (preferredCurrency, timeZone).
      window.location.assign("/logout")
    } catch (error) {
      handleAuthError(error, router)
      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, { description: humanizedError.description })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          title={t("profile.edit.form.title")}
          description={t("profile.edit.form.description")}
        >
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            {t("profile.edit.form.warning")}
          </div>

          <TextField
            control={form.control}
            description={t("profile.edit.username.desc")}
            label={t("profile.edit.username.label")}
            name="username"
            placeholder={t("profile.edit.username.placeholder")}
            disabled={isSubmitting}
          />

          <SelectField
            control={form.control}
            description={t("profile.edit.currency.desc")}
            label={t("profile.edit.currency.label")}
            name="preferredCurrency"
            options={PREFERRED_CURRENCIES.map((c) => ({
              value: c,
              label: PREFERRED_CURRENCY_LABEL[c],
            }))}
            placeholder={t("profile.edit.currency.placeholder")}
            disabled={isSubmitting}
            transformValue={(value) => (value ? value : undefined)}
          />

          <SelectField
            control={form.control}
            description={t("profile.edit.language.desc")}
            label={t("profile.edit.language.label")}
            name="preferredLanguage"
            options={PREFERRED_LANGUAGES.map((lang) => ({
              value: lang,
              label: PREFERRED_LANGUAGE_LABEL[lang],
            }))}
            placeholder={t("profile.edit.language.placeholder")}
            disabled={isSubmitting}
            transformValue={(value) => (value ? value : undefined)}
          />

          <SearchableSelectField
            control={form.control}
            description={t("profile.edit.timeZone.desc")}
            label={t("profile.edit.timeZone.label")}
            name="timeZone"
            options={TIME_ZONES.map((tz) => ({
              value: tz,
              label: TIME_ZONE_TO_IANA[tz],
            }))}
            placeholder={t("profile.edit.timeZone.placeholder")}
            searchPlaceholder={t("profile.edit.timeZone.searchPlaceholder")}
            disabled={isSubmitting}
            transformValue={(value) => (value ? value : undefined)}
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


