import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/utils/seo"

export const metadata: Metadata = buildNoIndexMetadata("Iniciar sesión")

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
