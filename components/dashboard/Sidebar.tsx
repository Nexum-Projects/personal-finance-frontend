"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { APP_VERSION } from "@/utils/app-version"
import type { User } from "@/app/actions/users/types"
import {
  LayoutDashboard,
  FolderTree,
  Wallet,
  Calendar,
  User as UserIcon,
  LogOut,
  Settings,
  Pencil,
  KeyRound,
  Receipt,
  ArrowLeftRight,
  BookOpen,
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
    name: "Cuentas",
    href: "/dashboard/accounts",
    icon: Wallet,
  },
  {
    name: "Categorías",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    name: "Transacciones",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    name: "Transferencias",
    href: "/dashboard/transfers",
    icon: ArrowLeftRight,
  },
  {
    name: "Presupuestos Mensuales",
    href: "/dashboard/monthly-periods",
    icon: Calendar,
  },
  {
    name: "Documentación",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [fallbackUsername, setFallbackUsername] = useState<string | null>(null)
  const [fallbackRole, setFallbackRole] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      // Intentar obtener el usuario completo
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // Si no se pudo obtener el usuario, intentar obtener al menos el username del token
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
              // Ignorar errores al decodificar
            }
          }
        } catch {
          // Ignorar errores
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

  const displayUsername = user?.username || fallbackUsername || "Usuario"
  const displayRole = user?.role
    ? humanizeRole(user.role)
    : fallbackRole
      ? humanizeRole(fallbackRole as any)
      : "Usuario"

  return (
    <div className="flex flex-col h-[100dvh] w-64 bg-card border-r border-border">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left",
                "hover:bg-accent hover:text-accent-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shrink-0">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayUsername}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {displayRole}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={8}
            className="w-56"
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                handleLinkClick(onClose)
                router.push("/dashboard/profile")
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Ver perfil
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                handleLinkClick(onClose)
                router.push("/dashboard/profile/edit")
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar usuario
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                handleLinkClick(onClose)
                router.push("/dashboard/profile/change-password")
              }}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Cambiar contraseña
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
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mt-3 text-center text-xs text-muted-foreground">
          {APP_VERSION}
        </div>
      </div>
    </div>
  )
}

