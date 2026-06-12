import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/utils/seo"

export const metadata: Metadata = buildNoIndexMetadata("Confirmar correo")

export default function ConfirmEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
