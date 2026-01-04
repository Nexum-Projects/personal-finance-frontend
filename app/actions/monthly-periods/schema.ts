import { z } from "zod"

export const monthlyPeriodSchema = z.object({
  year: z
    .number({
      required_error: "El año es requerido",
      invalid_type_error: "El año debe ser un número",
    })
    .int("El año debe ser un número entero")
    .min(1900, "El año debe ser mayor o igual a 1900")
    .max(9999, "El año debe ser menor o igual a 9999"),
  month: z
    .number({
      required_error: "El mes es requerido",
      invalid_type_error: "El mes debe ser un número",
    })
    .int("El mes debe ser un número entero")
    .min(1, "El mes debe estar entre 1 y 12")
    .max(12, "El mes debe estar entre 1 y 12"),
  initialSavingCents: z
    .number({
      required_error: "El ahorro inicial es requerido",
      invalid_type_error: "El ahorro inicial debe ser un número",
    })
    .min(0, "El ahorro inicial no puede ser negativa"),
})

export const monthlyPeriodUpdateSchema = z.object({
  initialSavingCents: z
    .number({
      required_error: "El ahorro inicial es requerido",
      invalid_type_error: "El ahorro inicial debe ser un número",
    })
    .min(0, "El ahorro inicial no puede ser negativa"),
})

export type MonthlyPeriodFormValues = z.infer<typeof monthlyPeriodSchema>
export type MonthlyPeriodUpdateFormValues = z.infer<typeof monthlyPeriodUpdateSchema>

