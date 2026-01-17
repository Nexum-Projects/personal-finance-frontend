import { z } from "zod"

import { PREFERRED_CURRENCIES, TIME_ZONES } from "@/utils/user-preferences"

export const registerSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido").max(255, "Máximo 255 caracteres"),
  email: z.string().email("El correo electrónico no es válido").max(255, "Máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(255, "Máximo 255 caracteres"),
  confirmPassword: z
    .string()
    .min(8, "Confirma tu contraseña (mínimo 8 caracteres)")
    .max(255, "Máximo 255 caracteres"),
  preferredCurrency: z.enum(PREFERRED_CURRENCIES, {
    message: "Selecciona una moneda válida",
  }),
  timeZone: z.enum(TIME_ZONES, {
    message: "Selecciona una zona horaria válida",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerSchema>

