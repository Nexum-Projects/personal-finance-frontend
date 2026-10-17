"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { AdminSidebar } from "@/components/dashboard/AdminSidebar"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n-provider"
import { UserPreferencesProvider } from "@/components/preferences/user-preferences-provider"
import type { UserPreferences } from "@/utils/user-preferences"

export function DashboardShell({
  children,
  preferences,
}: {
  children: React.ReactNode
  preferences: UserPreferences
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/dashboard/admin") ?? false
  const { t } = useI18n()
  const asideRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // Al abrir, el foco entra en el menú; al cerrarlo, vuelve al botón de la cabecera.
  useEffect(() => {
    if (sidebarOpen) {
      asideRef.current?.querySelector<HTMLElement>("a, button")?.focus()
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus()
    }
    wasOpen.current = sidebarOpen
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [sidebarOpen])

  return (
    <UserPreferencesProvider preferences={preferences}>
      <div className="flex h-[100dvh] overflow-x-hidden">
        {/* Overlay para móvil */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label={t("common.close")}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {/* Cerrado en móvil queda `invisible`: fuera de pantalla y fuera del orden de tabulación.
            `visibility` solo se anima al cerrar; al abrir cambia al instante para poder recibir el foco. */}
        <aside
          id="dashboard-sidebar"
          ref={asideRef}
          className={`fixed inset-y-0 left-0 z-50 transform duration-300 ease-in-out lg:visible lg:static ${sidebarOpen ? "visible translate-x-0 transition-transform" : "invisible -translate-x-full transition-[transform,visibility] lg:translate-x-0"} `}
        >
          {isAdminRoute ? (
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          ) : (
            <Sidebar onClose={() => setSidebarOpen(false)} />
          )}
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header con botón hamburguesa */}
          <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 lg:hidden">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              aria-label={t("nav.menu")}
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </UserPreferencesProvider>
  )
}
