"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/app/actions/auth"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n/i18n-provider"

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "El email o nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmEmailLink, setShowConfirmEmailLink] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const usernameOrEmailValue = watch("usernameOrEmail")

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    setShowConfirmEmailLink(false)

    try {
      const result = await login({
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
      })

      if (result.status === "error") {
        const rawError = result.errors[0] || "Error al iniciar sesión"
        const humanizedError = parseApiError(rawError)
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setError(humanizedError.description)

        // Mostrar CTA para reenviar confirmación cuando el backend indique que la cuenta
        // no está verificada (idealmente por code, y como fallback por mensajes/título).
        const rawMessage =
          rawError && typeof rawError === "object" && "message" in rawError
            ? String((rawError as { message?: unknown }).message ?? "")
            : ""
        const rawCode =
          rawError && typeof rawError === "object" && "code" in rawError
            ? String((rawError as { code?: unknown }).code ?? "")
            : ""

        const shouldShow =
          rawCode === "BAD_REQUEST/ACCOUNT_NOT_VERIFIED" ||
          humanizedError.title === "Cuenta no verificada" ||
          rawMessage === "User account is not verified" ||
          /no\s+ha\s+sido\s+verificada/i.test(humanizedError.description) ||
          /not\s+verified/i.test(humanizedError.description)

        setShowConfirmEmailLink(shouldShow)
        return
      }

      toast.success("Sesión iniciada", {
        description: "Has iniciado sesión exitosamente.",
      })

      // Redirigir al dashboard después de login exitoso
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      console.error("Error en login:", err)
      const humanizedError = parseApiError(err)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setError(humanizedError.description)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
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
          <CardDescription className="text-center">
            {t("auth.login.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {showConfirmEmailLink && (
              <div className="text-sm text-muted-foreground">
                {t("auth.login.confirmEmail.cta")}{" "}
                <Link
                  href={`/confirm-email/request${
                    typeof usernameOrEmailValue === "string" && usernameOrEmailValue.includes("@")
                      ? `?email=${encodeURIComponent(usernameOrEmailValue)}`
                      : ""
                  }`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("auth.login.confirmEmail.link")}
                </Link>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">{t("auth.login.usernameOrEmail.label")}</Label>
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder={t("auth.login.usernameOrEmail.placeholder")}
                {...register("usernameOrEmail")}
                disabled={isLoading}
                className={errors.usernameOrEmail ? "border-destructive" : ""}
              />
              {errors.usernameOrEmail && (
                <p className="text-sm text-destructive">{errors.usernameOrEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.login.password.label")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.password.placeholder")}
                  {...register("password")}
                  disabled={isLoading}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none disabled:opacity-50"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.login.submitting")}
                </>
              ) : (
                t("auth.login.submit")
              )}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/confirm-password"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                {t("auth.login.createAccount")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

