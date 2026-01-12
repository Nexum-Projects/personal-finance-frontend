import { z } from "zod"

export const monthlyBudgetSchema = z.object({
  monthlyPeriodId: z.string().min(1, "El presupuesto mensual es requerido"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  budgetedAmount: z
    .number({
      required_error: "El monto presupuestado es requerido",
      invalid_type_error: "El monto presupuestado debe ser un número",
    })
    .min(0, "El monto presupuestado no puede ser negativo")
    .min(0.01, "El monto presupuestado debe ser mayor a 0"),
})

export type MonthlyBudgetFormValues = z.infer<typeof monthlyBudgetSchema>

