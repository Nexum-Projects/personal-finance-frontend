import { z } from "zod"

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "La contraseña actual es requerida",
      invalid_type_error: "La contraseña actual debe ser texto",
    })
    .min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string({
      required_error: "La nueva contraseña es requerida",
      invalid_type_error: "La nueva contraseña debe ser texto",
    })
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>


