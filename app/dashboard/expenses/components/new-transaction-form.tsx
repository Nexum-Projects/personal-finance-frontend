"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createTransaction } from "@/app/actions/transactions"
import { TransactionForm } from "./transaction-form"
import type { TransactionFormValues } from "@/app/actions/transactions/schema"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { Category } from "@/app/actions/transactions/types"
import type { Account } from "@/app/actions/transactions/types"

type Props = {
  backToHref: string
  categories: Category[]
  accounts: Account[]
  categoryType: "INCOME" | "EXPENSE"
}

export function NewTransactionForm({ backToHref, categories, accounts, categoryType }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (formValues: TransactionFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await createTransaction(formValues, categoryType)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setIsSubmitting(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al crear la transacción"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setIsSubmitting(false)
        return
      }

      toast.success("Transacción creada", {
        description: (
          <>
            La transacción{" "}
            <span className="text-foreground font-medium">
              {result.data.description}
            </span>{" "}
            ha sido creada exitosamente.
          </>
        ),
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
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      backToHref={backToHref}
      categories={categories}
      accounts={accounts}
    />
  )
}

