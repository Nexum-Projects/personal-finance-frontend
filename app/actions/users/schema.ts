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
  preferredCurrency: z.enum(["USD", "GTQ", "MXN"]).optional(),
  timeZone: z.enum([
    "AMERICA_GUATEMALA",
    "AMERICA_MEXICO_CITY",
    "AMERICA_MONTERREY",
    "AMERICA_TIJUANA",
    "AMERICA_CANCUN",
    "AMERICA_NEW_YORK",
    "AMERICA_CHICAGO",
    "AMERICA_DENVER",
    "AMERICA_LOS_ANGELES",
    "AMERICA_PHOENIX",
  ]).optional(),
})

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>


