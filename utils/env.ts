import { z } from "zod"

/**
 * Env centralizado (estilo kitchenpos-web)
 * - Valida variables requeridas
 * - Evita repetir `process.env.*` por todo el código
 */
const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_URL es requerido"),
  NEXT_PUBLIC_SITE_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_SITE_NAME es requerido"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("Invalid site URL"),
})

// Usar valores de process.env o defaults si no existen
// El operador ?? asegura que siempre pasemos un string a Zod, no undefined
export const env = EnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})
