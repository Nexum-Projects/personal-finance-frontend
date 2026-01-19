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
import { categorySchema, type CategoryFormValues } from "@/app/actions/categories/schema"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"

type Props = {
  defaultValues?: CategoryFormValues
  onSubmit: SubmitHandler<CategoryFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
}: Props) {
  const { t } = useI18n()
  const { preferredLanguage } = useUserPreferences()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      name: "",
      categoryType: undefined,
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={
            isOnEdit ? t("categories.form.sectionDescEdit") : t("categories.form.sectionDescNew")
          }
          title={t("categories.form.sectionTitle")}
        >
          <TextField
            control={form.control}
            description={t("categories.form.name.desc")}
            label={t("categories.form.name.label")}
            name="name"
            placeholder={t("categories.form.name.placeholder")}
          />

          <SelectField
            control={form.control}
            description={t("categories.form.type.desc")}
            label={t("categories.form.type.label")}
            name="categoryType"
            options={[
              { label: humanizeCategoryType("INCOME", preferredLanguage), value: "INCOME" },
              { label: humanizeCategoryType("EXPENSE", preferredLanguage), value: "EXPENSE" },
            ]}
            placeholder={t("categories.form.type.placeholder")}
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

