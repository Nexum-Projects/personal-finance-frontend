import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmationDialog } from "@/components/display/confirmation-dialog"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance - Dashboard",
  description: "Gestión de finanzas personales",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ServiceWorkerCleanup />
        {children}
        <Toaster position="bottom-right" richColors />
        <ConfirmationDialog />
      </body>
    </html>
  )
}

