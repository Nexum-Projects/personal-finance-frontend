"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { useI18n } from "@/components/i18n/i18n-provider"
import {
  LayoutDashboard,
  FolderTree,
  Wallet,
  Calendar,
  Receipt,
  ArrowLeftRight,
  BookOpen,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarUserSection } from "@/components/dashboard/sidebar-user-section"

const handleLinkClick = (onClose?: () => void) => {
  if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
    onClose()
  }
}

const mainNavigationItems = [
  {
    nameKey: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    nameKey: "nav.accounts",
    href: "/dashboard/accounts",
    icon: Wallet,
  },
  {
    nameKey: "nav.categories",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    nameKey: "nav.transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    nameKey: "nav.transfers",
    href: "/dashboard/transfers",
    icon: ArrowLeftRight,
  },
  {
    nameKey: "nav.monthlyBudgets",
    href: "/dashboard/monthly-periods",
    icon: Calendar,
  },
  {
    nameKey: "nav.docs",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
]

const adminNavigationItem = {
  nameKey: "nav.admin",
  href: "/dashboard/admin/users",
  icon: Shield,
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useI18n()
  const [showAdminNav, setShowAdminNav] = useState(false)

  useEffect(() => {
    const loadAdminVisibility = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser?.role === "SYSADMIN") {
        setShowAdminNav(true)
        return
      }

      setShowAdminNav(false)
      if (!currentUser) {
        try {
          const cookies = document.cookie.split(";")
          const sessionCookie = cookies.find((c) => c.trim().startsWith("session="))
          if (sessionCookie) {
            try {
              const token = sessionCookie.split("=")[1]
              const payload = JSON.parse(atob(token.split(".")[1]))
              setShowAdminNav(payload?.role === "SYSADMIN")
            } catch {
              // Ignorar
            }
          }
        } catch {
          // Ignorar
        }
      }
    }

    loadAdminVisibility()
  }, [pathname])

  const navigationItems = showAdminNav
    ? [...mainNavigationItems, adminNavigationItem]
    : mainNavigationItems

  return (
    <div className="flex h-[100dvh] w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_1.png"
            alt="Nexum Finanzas Personales"
            width={40}
            height={40}
            priority
            className="h-10 w-10"
          />
          <div className="leading-tight">
            <p className="text-lg font-bold text-foreground">Nexum</p>
            <p className="text-xs text-muted-foreground">Finanzas Personales</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : item.href.startsWith("/dashboard/admin")
                ? pathname.startsWith("/dashboard/admin")
                : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(onClose)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {t(item.nameKey as any)}
            </Link>
          )
        })}
      </nav>

      <SidebarUserSection onClose={onClose} />
    </div>
  )
}
