import { z } from "zod"
import { PREFERRED_CURRENCIES, PREFERRED_LANGUAGES, TIME_ZONES } from "@/utils/user-preferences"

export const userUpdateSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
      invalid_type_error: "El nombre de usuario debe ser texto",
    })
    .trim()
    .min(1, "El nombre de usuario es requerido")
    .max(255, "El nombre de usuario no puede exceder 255 caracteres"),
  preferredCurrency: z.enum(PREFERRED_CURRENCIES).optional(),
  timeZone: z.enum(TIME_ZONES).optional(),
  preferredLanguage: z.enum(PREFERRED_LANGUAGES).optional(),
})

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>


