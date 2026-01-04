import { z } from "zod"

export const accountSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre debe tener máximo 255 caracteres"),
  accountType: z
    .string()
    .min(1, "El tipo de cuenta es requerido")
    .max(50, "El tipo de cuenta debe tener máximo 50 caracteres"),
  initialBalance: z
    .number({
      invalid_type_error: "El balance inicial debe ser un número",
    })
    .min(0, "El balance inicial no puede ser negativo")
    .optional(),
})

export type AccountFormValues = z.infer<typeof accountSchema>


