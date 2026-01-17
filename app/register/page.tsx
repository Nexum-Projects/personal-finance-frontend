"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, UserPlus } from "lucide-react"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { PasswordField } from "@/components/inputs/rhf/password-field"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { registerUser } from "@/app/actions/auth"
import {
  DEFAULT_PREFERRED_CURRENCY,
  DEFAULT_TIME_ZONE,
  PREFERRED_CURRENCIES,
  PREFERRED_CURRENCY_LABEL,
  TIME_ZONES,
  TIME_ZONE_TO_IANA,
} from "@/utils/user-preferences"
import { registerSchema, type RegisterFormValues } from "@/app/actions/auth/register-schema"

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferredCurrency: DEFAULT_PREFERRED_CURRENCY,
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
          <CardTitle className="text-xl font-bold text-center">Crear cuenta</CardTitle>
          <CardDescription className="text-center">
            Completa tus datos. Te enviaremos un correo para confirmar tu email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormSection
                title="Datos de acceso"
                description="Estos datos se usarán para iniciar sesión en el sistema"
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
                title="Preferencias"
                description="Se usarán para formatear montos y fechas en tu dashboard"
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
                    name="timeZone"
                    label="Zona horaria"
                    placeholder="Selecciona una zona horaria"
                    disabled={isSubmitting}
                    options={TIME_ZONES.map((tz) => ({
                      value: tz,
                      label: TIME_ZONE_TO_IANA[tz],
                    }))}
                  />
                </div>
              </FormSection>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear cuenta
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

