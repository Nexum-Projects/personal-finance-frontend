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
import { updateUser } from "@/app/actions/users"
import { userUpdateSchema, type UserUpdateFormValues } from "@/app/actions/users/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

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
        description: "Tu nombre de usuario fue actualizado correctamente.",
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
          title="Datos del usuario"
          description="Recuerda: este cambio solo actualiza tu nombre de usuario"
        >
          <TextField
            control={form.control}
            description="El nombre de usuario debe tener entre 1 y 255 caracteres"
            label="Nombre de usuario"
            name="username"
            placeholder="Ingresa tu nombre de usuario"
            disabled={isSubmitting}
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


