"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { updateTransaction } from "@/app/actions/transactions"
import { TransactionForm } from "./transaction-form"
import type { TransactionFormValues } from "@/app/actions/transactions/schema"
import type { Transaction } from "@/app/actions/transactions/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { centsToDecimal } from "@/utils/helpers/format-amount"
import type { Category } from "@/app/actions/transactions/types"
import type { Account } from "@/app/actions/transactions/types"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  transaction: Transaction
  backToHref: string
  categories: Category[]
  accounts: Account[]
  categoryType: "INCOME" | "EXPENSE"
}

export function EditTransactionForm({ 
  transaction, 
  backToHref, 
  categories,
  accounts,
  categoryType 
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  const onSubmit = async (formValues: TransactionFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await updateTransaction(transaction.id, formValues, categoryType)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("transactions.errorUpdate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success(t("toast.transaction.updated"), {
        description: t("toast.transaction.updated.desc"),
      })

      router.push(backToHref)
      router.refresh()
    } catch (error) {
      // Manejar errores de autenticación
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <TransactionForm
      defaultValues={{
        amount: centsToDecimal(transaction.amountCents),
        description: transaction.description,
        categoryId: transaction.category.id,
        accountId: transaction.account.id,
        transactionDate: transaction.transactionDate,
      }}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      isOnEdit
      categories={categories}
      accounts={accounts}
    />
  )
}

