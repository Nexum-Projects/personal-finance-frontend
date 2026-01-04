import { z } from "zod"

/**
 * Env centralizado (estilo kitchenpos-web)
 * - Valida variables requeridas
 * - Evita repetir `process.env.*` por todo el código
 */
const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_URL es requerido")
    .default("http://localhost:8080/api"),
})

export const env = EnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})


