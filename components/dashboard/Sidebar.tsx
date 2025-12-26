"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import {
  LayoutDashboard,
  FolderTree,
  TrendingDown,
  TrendingUp,
  User,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const handleLinkClick = (onClose?: () => void) => {
  // Cerrar sidebar en móvil/tablet al hacer click en un link
  if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
    onClose()
  }
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Categorías",
    href: "/dashboard/categorias",
    icon: FolderTree,
  },
  {
    name: "Gastos",
    href: "/dashboard/gastos",
    icon: TrendingDown,
  },
  {
    name: "Ingresos",
    href: "/dashboard/ingresos",
    icon: TrendingUp,
  },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const getUsernameFromToken = () => {
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((c) => c.trim().startsWith("session="))

      if (sessionCookie) {
        try {
          const token = sessionCookie.split("=")[1]
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUsername(payload?.username || payload?.sub || "Usuario")
        } catch {
          setUsername("Usuario")
        }
      }
    }

    getUsernameFromToken()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Personal Finance</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          // Para dashboard, solo coincidencia exacta. Para otros, también subrutas
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(onClose)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {username || "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground truncate">Usuario</p>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard/perfil" onClick={() => handleLinkClick(onClose)}>
              <Settings className="mr-2 h-4 w-4" />
              Ver Perfil
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}

