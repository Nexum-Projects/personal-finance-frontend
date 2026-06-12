import type { Metadata } from "next"

import { buildRegisterMetadata } from "@/utils/seo"

export const metadata: Metadata = buildRegisterMetadata()

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
