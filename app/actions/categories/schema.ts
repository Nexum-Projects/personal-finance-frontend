import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre debe tener máximo 255 caracteres"),
  categoryType: z.enum(["INCOME", "EXPENSE"], {
    required_error: "El tipo de categoría es requerido",
  }),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

