import { z } from "zod"

export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "El monto es requerido",
      invalid_type_error: "El monto debe ser un número",
    })
    .positive("El monto debe ser mayor a 0")
    .min(0.01, "El monto debe ser mayor a 0"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(255, "La descripción debe tener máximo 255 caracteres"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  accountId: z.string().min(1, "La cuenta es requerida"),
  transactionDate: z.string().min(1, "La fecha de transacción es requerida"),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

