"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { Loader2 } from "lucide-react"
import { passwordReset } from "@/app/actions/auth"

const schema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
})

type FormValues = z.infer<typeof schema>

export default function ConfirmPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await passwordReset({ email: data.email })

      if (result.status === "error") {
        const humanizedError = parseApiError(result.errors[0] || "Error al solicitar recuperación")
        toast.error(humanizedError.title, { description: humanizedError.description })
        setError(humanizedError.description)
        return
      }

      toast.success("Correo enviado", {
        description: "Si el correo existe, recibirás un link para restablecer tu contraseña.",
      })

      router.push("/login")
      router.refresh()
    } catch (err: any) {
      const humanizedError = parseApiError(err)
      toast.error(humanizedError.title, { description: humanizedError.description })
      setError(humanizedError.description)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico y te enviaremos un link para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu-correo@ejemplo.com"
                {...register("email")}
                disabled={isLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link"
              )}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground underline-offset-4 hover:underline"
              >
                Volver al login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


