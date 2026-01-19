import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmationDialog } from "@/components/display/confirmation-dialog"
import { env } from "@/utils/env"
import getSession from "@/app/actions/auth/getSession"
import { getLanguageFromSession } from "@/utils/i18n/get-language-from-session"
import { getMessages } from "@/utils/i18n/messages"
import { I18nProvider } from "@/components/i18n/i18n-provider"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const language = getLanguageFromSession(session as Record<string, unknown> | null)
  const messages = getMessages(language)

  return (
    <html lang={language.toLowerCase()} className="dark">
      <body className={inter.className}>
        <ServiceWorkerCleanup />
        <I18nProvider language={language} messages={messages}>
          {children}
        </I18nProvider>
        <Toaster position="bottom-right" richColors />
        <ConfirmationDialog />
      </body>
    </html>
  )
}

