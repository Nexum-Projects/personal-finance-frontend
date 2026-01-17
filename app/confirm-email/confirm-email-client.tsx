"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, CircleCheck, CircleX } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { confirmEmail } from "@/app/actions/auth"
import { parseApiError } from "@/utils/helpers/parse-api-error"

type Props = {
  token: string
}

type Status = "idle" | "loading" | "success" | "error"

export function ConfirmEmailClient({ token }: Props) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const hasToken = useMemo(() => !!token, [token])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!hasToken) {
        setStatus("error")
        setErrorMessage("El link no contiene token. Solicita un nuevo correo de confirmación.")
        return
      }

      setStatus("loading")
      setErrorMessage(null)

      try {
        const result = await confirmEmail({ token })

        if (cancelled) return

        if (result.status === "error") {
          const humanizedError = parseApiError(result.errors[0] || "Error al confirmar email")
          setStatus("error")
          setErrorMessage(humanizedError.description)
          toast.error(humanizedError.title, { description: humanizedError.description })
          return
        }

        setStatus("success")
        toast.success("Email confirmado", {
          description: "Tu correo se confirmó correctamente. Ya puedes iniciar sesión.",
        })
      } catch (err) {
        if (cancelled) return
        const humanizedError = parseApiError(err)
        setStatus("error")
        setErrorMessage(humanizedError.description)
        toast.error(humanizedError.title, { description: humanizedError.description })
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [hasToken, token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
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
          <CardTitle className="text-xl font-bold text-center">Confirmación de email</CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Estamos confirmando tu correo..."}
            {status === "success" && "Tu correo fue confirmado correctamente."}
            {status === "error" && "No se pudo confirmar tu correo."}
            {(status === "idle" || !status) && "Procesando..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirmando...
            </div>
          )}

          {status === "success" && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100">
              <div className="flex items-start gap-2">
                <CircleCheck className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="font-medium">Email confirmado</div>
                  <div className="text-emerald-800/90 dark:text-emerald-100/90">
                    Ya puedes iniciar sesión con tu usuario.
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <CircleX className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="font-medium">Confirmación fallida</div>
                  <div className="text-destructive/90">{errorMessage ?? "Ocurrió un error inesperado."}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" disabled={status === "loading"}>
              <Link href="/login">Ir al login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" disabled={status === "loading"}>
              <Link href="/confirm-password">¿Olvidaste tu contraseña?</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

