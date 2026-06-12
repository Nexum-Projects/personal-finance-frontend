import type { Metadata } from "next"

import { buildNoIndexMetadata } from "@/utils/seo"

export const metadata: Metadata = buildNoIndexMetadata("Restablecer contraseña")

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
