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
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { PREFERRED_CURRENCY_LABEL } from "@/utils/user-preferences"

type Props = {
  transfer: Transfer
  backToHref: string
}

export function EditTransferForm({ transfer, backToHref }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()
  const { preferredCurrency } = useUserPreferences()

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
          result.errors[0] || t("transfers.errorUpdate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.transfer.updated"), {
        description: t("toast.transfer.updated.desc"),
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
          description={t("transfers.edit.sectionSubtitle")}
          title={t("transfers.edit.sectionTitle")}
        >
          <NumericField
            control={form.control}
            decimalScale={2}
            description={t("transfers.form.amount.desc", {
              currency: PREFERRED_CURRENCY_LABEL[preferredCurrency],
            })}
            label={t("transfers.form.amount.label")}
            name="amountCents"
            placeholder="0.00"
          />

          <TextField
            control={form.control}
            description={t("transfers.form.description.desc")}
            label={t("transfers.form.description.label")}
            name="description"
            placeholder={t("transfers.form.description.placeholder")}
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
            {t("common.save")}
          </Button>
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={backToHref}>{t("common.cancel")}</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

