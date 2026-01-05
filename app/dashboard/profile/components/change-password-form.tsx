"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
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

const formSchema = changePasswordSchema.extend({
  confirmNewPassword: z.string().min(8, "Confirma tu nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
})

type FormValues = ChangePasswordFormValues & { confirmNewPassword: string }

type Props = {
  backToHref: string
}

export function ChangePasswordForm({ backToHref }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

        const humanizedError = parseApiError(result.errors[0] || "Error al cambiar contraseña")
        toast.error(humanizedError.title, { description: humanizedError.description })
        return
      }

      toast.success("Contraseña actualizada", {
        description: "Tu contraseña fue actualizada correctamente.",
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
          title="Seguridad"
          description="Tu nueva contraseña debe ser diferente a la anterior"
        >
          <div className="relative">
            <TextField
              control={form.control}
              label="Contraseña actual"
              name="currentPassword"
              placeholder="Ingresa tu contraseña actual"
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <div className="relative">
            <TextField
              control={form.control}
              label="Nueva contraseña"
              name="newPassword"
              placeholder="Ingresa tu nueva contraseña"
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <div className="relative">
            <TextField
              control={form.control}
              label="Confirmar nueva contraseña"
              name="confirmNewPassword"
              placeholder="Confirma tu nueva contraseña"
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
                <EyeOff className="h-4 w-4" /> Ocultar contraseñas
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4" /> Mostrar contraseñas
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
            Guardar
          </Button>
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={backToHref}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}


