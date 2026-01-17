"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { confirmEmailRequest } from "@/app/actions/auth"

const schema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
})

type FormValues = z.infer<typeof schema>

type Props = {
  defaultEmail?: string
}

export function ConfirmEmailRequestClient({ defaultEmail }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await confirmEmailRequest({ email: data.email })

      if (result.status === "error") {
        const humanizedError = parseApiError(result.errors[0] || "Error al solicitar confirmación")
        toast.error(humanizedError.title, { description: humanizedError.description })
        setError(humanizedError.description)
        return
      }

      toast.success("Correo enviado", {
        description: "Si el correo existe, recibirás un link para confirmar tu email.",
      })
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
          <CardTitle className="text-xl font-bold text-center">Reenviar confirmación de email</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo y te enviaremos un link para confirmar tu cuenta.
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
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar correo de confirmación"
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-muted-foreground underline-offset-4 hover:underline">
                Volver al login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

