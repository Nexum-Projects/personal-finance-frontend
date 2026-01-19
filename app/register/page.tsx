"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, UserPlus } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { SearchableSelectField } from "@/components/inputs/rhf/searchable-select-field"
import { PasswordField } from "@/components/inputs/rhf/password-field"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { registerUser } from "@/app/actions/auth"
import {
  DEFAULT_PREFERRED_CURRENCY,
  DEFAULT_PREFERRED_LANGUAGE,
  DEFAULT_TIME_ZONE,
  PREFERRED_CURRENCIES,
  PREFERRED_CURRENCY_LABEL,
  PREFERRED_LANGUAGES,
  PREFERRED_LANGUAGE_LABEL,
  TIME_ZONES,
  TIME_ZONE_TO_IANA,
} from "@/utils/user-preferences"
import { registerSchema, type RegisterFormValues } from "@/app/actions/auth/register-schema"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferredCurrency: DEFAULT_PREFERRED_CURRENCY,
      preferredLanguage: DEFAULT_PREFERRED_LANGUAGE,
      timeZone: DEFAULT_TIME_ZONE,
    },
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    setIsSubmitting(true)
    try {
      const result = await registerUser(values)

      if (result.status === "error") {
        const humanizedError = parseApiError(result.errors[0] || "Error al registrarse")
        toast.error(humanizedError.title, { description: humanizedError.description })
        return
      }

      toast.success("Cuenta creada", {
        description: "Revisa tu correo y confirma tu email para poder iniciar sesión.",
      })

      router.push("/login")
      router.refresh()
    } catch (error) {
      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, { description: humanizedError.description })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <Image
              src="/images/logo_2.png"
              alt="Nexum Finanzas Personales"
              width={320}
              height={140}
              priority
              className="h-auto w-auto"
            />
          </div>
          <CardTitle className="text-xl font-bold text-center">
            {t("auth.register.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.register.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormSection
                title={t("auth.register.access.title")}
                description={t("auth.register.access.subtitle")}
                orientation="vertical"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    control={form.control}
                    name="username"
                    label="Nombre de usuario"
                    placeholder="Ej: johndoe"
                    disabled={isSubmitting}
                  />
                  <TextField
                    control={form.control}
                    name="email"
                    label="Correo electrónico"
                    placeholder="Ej: john@example.com"
                    disabled={isSubmitting}
                    type="email"
                  />
                  <PasswordField
                    control={form.control}
                    name="password"
                    label="Contraseña"
                    placeholder="Mínimo 8 caracteres"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    control={form.control}
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    placeholder="Repite tu contraseña"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
              </FormSection>

              <FormSection
                title={t("auth.register.prefs.title")}
                description={t("auth.register.prefs.subtitle")}
                orientation="vertical"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <SelectField
                    control={form.control}
                    name="preferredCurrency"
                    label="Moneda preferida"
                    placeholder="Selecciona una moneda"
                    disabled={isSubmitting}
                    options={PREFERRED_CURRENCIES.map((c) => ({
                      value: c,
                      label: PREFERRED_CURRENCY_LABEL[c],
                    }))}
                  />

                  <SelectField
                    control={form.control}
                    name="preferredLanguage"
                    label="Idioma"
                    placeholder="Selecciona un idioma"
                    disabled={isSubmitting}
                    options={PREFERRED_LANGUAGES.map((lang) => ({
                      value: lang,
                      label: PREFERRED_LANGUAGE_LABEL[lang],
                    }))}
                  />

                  <SearchableSelectField
                    control={form.control}
                    name="timeZone"
                    label="Zona horaria"
                    placeholder="Selecciona una zona horaria"
                    disabled={isSubmitting}
                    options={TIME_ZONES.map((tz) => ({
                      value: tz,
                      label: TIME_ZONE_TO_IANA[tz],
                    }))}
                    searchPlaceholder="Buscar zona horaria (ej. Guatemala, Lima, Bogotá...)"
                  />
                </div>
              </FormSection>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.register.submitting")}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("auth.register.submit")}
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t("auth.register.haveAccount")}{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  {t("auth.register.login")}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

