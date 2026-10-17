"use client"

import { useEffect, useState } from "react"
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
        <aside
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
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
              variant="ghost"
              size="icon"
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
