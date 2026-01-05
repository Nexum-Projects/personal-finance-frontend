import { z } from "zod"

export const userUpdateSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
      invalid_type_error: "El nombre de usuario debe ser texto",
    })
    .trim()
    .min(1, "El nombre de usuario es requerido")
    .max(255, "El nombre de usuario no puede exceder 255 caracteres"),
})

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>


