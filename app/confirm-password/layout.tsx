import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/utils/seo"

export const metadata: Metadata = buildNoIndexMetadata("Confirmar contraseña")

export default function ConfirmPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
