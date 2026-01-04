"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateTransfer } from "@/app/actions/transfers"
import { transferUpdateSchema, type TransferUpdateFormValues } from "@/app/actions/transfers/schema"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { NumericField } from "@/components/inputs/rhf/numeric-field"
import { TextField } from "@/components/inputs/rhf/text-field"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { centsToDecimal } from "@/utils/helpers/format-amount"
import type { Transfer } from "@/app/actions/transfers"

type Props = {
  transfer: Transfer
  backToHref: string
}

export function EditTransferForm({ transfer, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<TransferUpdateFormValues>({
    resolver: zodResolver(transferUpdateSchema),
    defaultValues: {
      amountCents: centsToDecimal(transfer.amountCents),
      description: transfer.description,
    },
  })

  const onSubmit: SubmitHandler<TransferUpdateFormValues> = async (formValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateTransfer(transfer.id, formValues)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al actualizar la transferencia"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Transferencia actualizada", {
        description: "La transferencia ha sido actualizada exitosamente",
      })

      router.push("/dashboard/transfers")
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description="Actualiza los datos de la transferencia"
          title="Editar Transferencia"
        >
          <NumericField
            control={form.control}
            decimalScale={2}
            description="Ingresa el monto a transferir (en quetzales)"
            label="Monto"
            name="amountCents"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description="Describe el propósito de la transferencia"
            label="Descripción"
            name="description"
            placeholder="Ingresa una descripción"
            type="text"
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

