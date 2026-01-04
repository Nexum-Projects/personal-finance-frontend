import { z } from "zod"

export const transferSchema = z.object({
  amountCents: z
    .number({
      required_error: "El monto es requerido",
      invalid_type_error: "El monto debe ser un número",
    })
    .min(0.01, "El monto debe ser mayor a 0"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción debe tener máximo 500 caracteres"),
  transferDate: z
    .string()
    .min(1, "La fecha de transferencia es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD"),
  fromAccountId: z
    .string()
    .min(1, "La cuenta de origen es requerida")
    .uuid("La cuenta de origen debe ser un UUID válido"),
  toAccountId: z
    .string()
    .min(1, "La cuenta de destino es requerida")
    .uuid("La cuenta de destino debe ser un UUID válido"),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: "La cuenta de origen y destino no pueden ser la misma",
  path: ["toAccountId"],
})

export const transferUpdateSchema = z.object({
  amountCents: z
    .number({
      required_error: "El monto es requerido",
      invalid_type_error: "El monto debe ser un número",
    })
    .min(0.01, "El monto debe ser mayor a 0")
    .optional(),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción debe tener máximo 500 caracteres")
    .optional(),
}).refine((data) => data.amountCents !== undefined || data.description !== undefined, {
  message: "Al menos uno de los campos (monto o descripción) debe ser proporcionado",
})

export type TransferFormValues = z.infer<typeof transferSchema>
export type TransferUpdateFormValues = z.infer<typeof transferUpdateSchema>

