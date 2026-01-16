import Link from "next/link"
import {
  BookOpen,
  LayoutDashboard,
  Wallet,
  FolderTree,
  Receipt,
  ArrowLeftRight,
  Calendar,
  User,
  Sparkles,
} from "lucide-react"

import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DocImagePlaceholder } from "@/components/docs/doc-image-placeholder"

type DocLink = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const DOC_LINKS: DocLink[] = [
  {
    title: "Primeros pasos",
    description: "Qué crear primero para empezar a usar el sistema (checklist).",
    href: "/dashboard/docs/getting-started",
    icon: Sparkles,
  },
  {
    title: "Dashboard",
    description: "Resumen financiero, gráficas y analítica de presupuestos mensuales.",
    href: "/dashboard/docs/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cuentas",
    description: "Crea y administra cuentas, balances y tipos de cuenta.",
    href: "/dashboard/docs/accounts",
    icon: Wallet,
  },
  {
    title: "Categorías",
    description: "Gestiona categorías de ingresos y gastos, con filtros por tipo.",
    href: "/dashboard/docs/categories",
    icon: FolderTree,
  },
  {
    title: "Transacciones",
    description: "Registro de ingresos y gastos, búsqueda, filtros y acciones.",
    href: "/dashboard/docs/transactions",
    icon: Receipt,
  },
  {
    title: "Transferencias",
    description: "Transferencias entre cuentas con control de origen/destino.",
    href: "/dashboard/docs/transfers",
    icon: ArrowLeftRight,
  },
  {
    title: "Presupuestos mensuales",
    description: "Períodos mensuales, presupuestos por categoría y analíticas.",
    href: "/dashboard/docs/monthly-budgets",
    icon: Calendar,
  },
  {
    title: "Perfil y seguridad",
    description: "Preferencias (moneda/zona horaria), cambiar contraseña y cierre de sesión.",
    href: "/dashboard/docs/profile",
    icon: User,
  },
]

export default function DocsIndexPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Documentación"
        description="Guía rápida por módulos para aprender a usar el sistema: propósito, filtros, acciones y pantallas clave."
        actions={
          <Link
            href="/dashboard"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Ir al Dashboard
          </Link>
        }
      />

      <DocImagePlaceholder
        title="[IMAGEN / GIF] Vista general de la navegación"
        description="Sugerencia: captura del sidebar con los módulos principales y el menú del avatar."
      />

      <Card>
        <CardHeader>
          <CardTitle>Índice</CardTitle>
          <CardDescription>Selecciona un módulo para ver su funcionamiento.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_LINKS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group rounded-lg border p-4 transition-colors",
                  "hover:bg-accent/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md border bg-background p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium group-hover:underline underline-offset-4">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convenciones generales</CardTitle>
          <CardDescription>Cómo interpretar tablas, filtros y acciones en todo el sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Búsqueda</b>: la mayoría de listados incluye un campo de búsqueda para filtrar por texto.
            </li>
            <li>
              <b>Filtros</b>: algunos listados incluyen un panel de filtros (por ejemplo, rango de fechas y tipo).
            </li>
            <li>
              <b>Ordenamiento</b>: en muchas tablas puedes ordenar haciendo clic en encabezados (cuando hay iconos de orden).
            </li>
            <li>
              <b>Paginación</b>: si hay muchos registros, se muestran por páginas (normalmente 10 por defecto).
            </li>
            <li>
              <b>Acciones por fila</b>: en cada registro suele haber un menú de acciones (ver, editar, eliminar).
            </li>
            <li>
              <b>Reset de página</b>: cuando cambias búsqueda/filtros, el sistema suele volver a la página 1 para evitar “páginas vacías”.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glosario rápido</CardTitle>
          <CardDescription>Términos usados en las pantallas y en esta guía.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b>Ingreso</b>: dinero que entra a una cuenta (ej. salario).
            </li>
            <li>
              <b>Gasto</b>: dinero que sale de una cuenta (ej. comida).
            </li>
            <li>
              <b>Transferencia</b>: movimiento interno entre dos cuentas (no usa categoría).
            </li>
            <li>
              <b>Presupuesto mensual</b>: período por mes y año (ej. Marzo 2026) usado para analítica y presupuestos por categoría.
            </li>
            <li>
              <b>Presupuesto por categoría</b>: monto planeado para gastar en una categoría dentro de un presupuesto mensual.
            </li>
            <li>
              <b>Rango de fechas</b>: filtro “inicio/fin” para limitar datos a un período.
            </li>
            <li>
              <b>Acciones</b>: botones/menús para operar sobre un registro: ver, editar, eliminar (y en algunos módulos reactivar).
            </li>
          </ul>
          <DocImagePlaceholder
            title="[IMAGEN / GIF] Ejemplos de búsqueda, filtros y acciones"
            description="Sugerencia: captura de una tabla mostrando el buscador, el panel de filtros y el menú de acciones por fila."
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}

