"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { APP_VERSION } from "@/utils/app-version"
import type { User, UserRole } from "@/app/actions/users/types"
import { useI18n } from "@/components/i18n/i18n-provider"
import {
  User as UserIcon,
  LogOut,
  Settings,
  Pencil,
  KeyRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const handleLinkClick = (onClose?: () => void) => {
  if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
    onClose()
  }
}

interface SidebarUserSectionProps {
  onClose?: () => void
}

export function SidebarUserSection({ onClose }: SidebarUserSectionProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = useI18n()
  const [user, setUser] = useState<User | null>(null)
  const [fallbackUsername, setFallbackUsername] = useState<string | null>(null)
  const [fallbackRole, setFallbackRole] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (!currentUser) {
        try {
          const cookies = document.cookie.split(";")
          const sessionCookie = cookies.find((c) => c.trim().startsWith("session="))

          if (sessionCookie) {
            try {
              const token = sessionCookie.split("=")[1]
              const payload = JSON.parse(atob(token.split(".")[1]))
              setFallbackUsername(payload?.username || payload?.sub || null)
              setFallbackRole(payload?.role || null)
            } catch {
              // Ignorar
            }
          }
        } catch {
          // Ignorar
        }
      }
    }

    loadUser()
  }, [pathname])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  const displayUsername = user?.username || fallbackUsername || t("common.user")
  const displayRole = user?.role
    ? humanizeRole(user.role, language)
    : fallbackRole
      ? humanizeRole(fallbackRole as UserRole, language)
      : t("common.user")

  return (
    <div className="p-4 border-t border-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left",
              "hover:bg-accent hover:text-accent-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shrink-0">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayUsername}</p>
              <p className="text-xs text-muted-foreground truncate">{displayRole}</p>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              handleLinkClick(onClose)
              router.push("/dashboard/profile")
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t("nav.profile.view")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              handleLinkClick(onClose)
              router.push("/dashboard/profile/edit")
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t("nav.profile.edit")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              handleLinkClick(onClose)
              router.push("/dashboard/profile/change-password")
            }}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {t("nav.profile.changePassword")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={async (e) => {
              e.preventDefault()
              handleLinkClick(onClose)
              await handleLogout()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("nav.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-3 text-center text-xs text-muted-foreground">{APP_VERSION}</div>
    </div>
  )
}
