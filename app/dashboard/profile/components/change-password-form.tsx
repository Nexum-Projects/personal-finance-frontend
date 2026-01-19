"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMemo, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Save } from "lucide-react"
import * as z from "zod"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { changePassword } from "@/app/actions/auth"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/app/actions/auth/change-password-schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type FormValues = ChangePasswordFormValues & { confirmNewPassword: string }

type Props = {
  backToHref: string
}

export function ChangePasswordForm({ backToHref }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useI18n()

  const formSchema = useMemo(() => {
    return changePasswordSchema
      .extend({
        confirmNewPassword: z.string().min(8, t("profile.password.validation.confirmRequired")),
      })
      .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: t("profile.password.validation.mismatch"),
        path: ["confirmNewPassword"],
      })
  }, [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true)
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) return

        const humanizedError = parseApiError(
          result.errors[0] || t("profile.password.error.changePassword")
        )
        toast.error(humanizedError.title, { description: humanizedError.description })
        return
      }

      toast.success(t("profile.password.toast.updated.title"), {
        description: t("profile.password.toast.updated.description"),
      })

      router.push(backToHref)
      router.refresh()
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
          title={t("profile.password.form.sectionTitle")}
          description={t("profile.password.form.sectionDescription")}
        >
          <div className="relative">
            <TextField
              control={form.control}
              label={t("profile.password.form.current.label")}
              name="currentPassword"
              placeholder={t("profile.password.form.current.placeholder")}
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <div className="relative">
            <TextField
              control={form.control}
              label={t("profile.password.form.new.label")}
              name="newPassword"
              placeholder={t("profile.password.form.new.placeholder")}
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <div className="relative">
            <TextField
              control={form.control}
              label={t("profile.password.form.confirm.label")}
              name="confirmNewPassword"
              placeholder={t("profile.password.form.confirm.placeholder")}
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            disabled={isSubmitting}
            className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            {showPassword ? (
              <span className="inline-flex items-center gap-2">
                <EyeOff className="h-4 w-4" /> {t("profile.password.form.toggle.hide")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4" /> {t("profile.password.form.toggle.show")}
              </span>
            )}
          </button>
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


