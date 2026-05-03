"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ArrowLeft, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/i18n/i18n-provider"
import { SidebarUserSection } from "@/components/dashboard/sidebar-user-section"

const handleLinkClick = (onClose?: () => void) => {
  if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
    onClose()
  }
}

interface AdminSidebarProps {
  onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { t } = useI18n()

  const usersActive = pathname.startsWith("/dashboard/admin/users")

  return (
    <div className="flex h-[100dvh] w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_1.png"
            alt="Nexum"
            width={40}
            height={40}
            priority
            className="h-10 w-10"
          />
          <div className="min-w-0 leading-tight">
            <p className="text-lg font-bold text-foreground">Nexum</p>
            <p className="text-xs font-medium text-primary">{t("admin.sidebar.brandSubtitle")}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <Link
          href="/dashboard"
          onClick={() => handleLinkClick(onClose)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "border border-border bg-muted/40 text-foreground hover:bg-muted",
          )}
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          {t("admin.sidebar.backToApp")}
        </Link>

        <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.sidebar.sectionMenu")}
        </p>

        <Link
          href="/dashboard/admin/users"
          onClick={() => handleLinkClick(onClose)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            usersActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Users className="h-5 w-5 shrink-0" />
          {t("admin.nav.users")}
        </Link>
      </nav>

      <SidebarUserSection onClose={onClose} />
    </div>
  )
}
