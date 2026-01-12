import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmationDialog } from "@/components/display/confirmation-dialog"
import { env } from "@/utils/env"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: env.NEXT_PUBLIC_SITE_NAME,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  icons: {
    icon: "/images/logo_1.png",
    shortcut: "/images/logo_1.png",
    apple: "/images/logo_1.png",
  },
};

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

