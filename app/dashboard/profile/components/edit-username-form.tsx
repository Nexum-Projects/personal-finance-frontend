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
import { updateUser } from "@/app/actions/users"
import { userUpdateSchema, type UserUpdateFormValues } from "@/app/actions/users/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import {
  PREFERRED_CURRENCIES,
  PREFERRED_CURRENCY_LABEL,
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

        const humanizedError = parseApiError(result.errors[0] || "Error al actualizar usuario")
        toast.error(humanizedError.title, { description: humanizedError.description })
        return
      }

      toast.success("Usuario actualizado", {
        description:
          "Guardamos tus cambios. Se cerrará tu sesión para aplicar moneda y zona horaria.",
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
          title="Preferencias y datos del usuario"
          description="Actualiza tu nombre de usuario y tus preferencias de moneda y zona horaria"
        >
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            Al guardar estos cambios, se cerrará tu sesión automáticamente para aplicar la moneda y la
            zona horaria. Luego tendrás que iniciar sesión de nuevo.
          </div>

          <TextField
            control={form.control}
            description="El nombre de usuario debe tener entre 1 y 255 caracteres"
            label="Nombre de usuario"
            name="username"
            placeholder="Ingresa tu nombre de usuario"
            disabled={isSubmitting}
          />

          <SelectField
            control={form.control}
            description="La moneda se usa para formatear montos en toda la aplicación"
            label="Moneda preferida"
            name="preferredCurrency"
            options={PREFERRED_CURRENCIES.map((c) => ({
              value: c,
              label: PREFERRED_CURRENCY_LABEL[c],
            }))}
            placeholder="Selecciona una moneda"
            disabled={isSubmitting}
            transformValue={(value) => (value ? value : undefined)}
          />

          <SelectField
            control={form.control}
            description="La zona horaria se usa para mostrar fechas y horas"
            label="Zona horaria"
            name="timeZone"
            options={TIME_ZONES.map((tz) => ({
              value: tz,
              label: TIME_ZONE_TO_IANA[tz],
            }))}
            placeholder="Selecciona una zona horaria"
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


