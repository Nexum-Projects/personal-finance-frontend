import { Metadata } from "next"
import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { PREFERRED_CURRENCY_LABEL, timeZoneToIana } from "@/utils/user-preferences"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { KeyRound, Pencil } from "lucide-react"

export const metadata: Metadata = {
  title: "Mi perfil",
}

function formatDate(dateString: string, timeZone: string): string {
  try {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat("es-GT", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    return formatter.format(date)
  } catch {
    return dateString
  }
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  // Si no hay usuario, mostrar 404
  // (Si hay un error de autenticación, handleAuthErrorServer ya redirigió al login)
  if (!user) {
    return notFound()
  }

  const timeZoneIana = timeZoneToIana(user.timeZone)

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard",
          label: "Regresar al dashboard",
        }}
        title={user.username}
        actions={{
          edit: {
            type: "link",
            href: "/dashboard/profile/edit",
            label: "Editar usuario",
            icon: Pencil,
          },
          changePassword: {
            type: "link",
            href: "/dashboard/profile/change-password",
            label: "Cambiar contraseña",
            icon: KeyRound,
            variant: "outline",
          },
        }}
      />
      <PageSection
        description="Información personal del usuario"
        fields={{
          id: {
            label: "Identificador",
            value: user.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          username: {
            label: "Nombre de usuario",
            value: user.username,
          },
          email: {
            label: "Correo electrónico",
            value: user.email,
          },
          role: {
            label: "Rol",
            value: humanizeRole(user.role),
          },
          preferredCurrency: {
            label: "Moneda preferida",
            value: PREFERRED_CURRENCY_LABEL[user.preferredCurrency],
          },
          timeZone: {
            label: "Zona horaria",
            value: timeZoneIana,
          },
          isActive: {
            label: "Estado",
            value: user.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Activo
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                Inactivo
              </span>
            ),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(user.createdAt, timeZoneIana),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(user.updatedAt, timeZoneIana),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}
