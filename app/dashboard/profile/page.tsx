import { Metadata } from "next"
import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Mi perfil",
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
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

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard",
          label: "Regresar al dashboard",
        }}
        title={user.username}
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
            value: formatDate(user.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(user.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}
