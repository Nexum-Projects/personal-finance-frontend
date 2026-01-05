import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { ChangePasswordForm } from "../components/change-password-form"

export default async function ChangePasswordPage() {
  const user = await getCurrentUser()
  if (!user) return notFound()

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/profile",
          label: "Regresar a mi perfil",
        }}
        title="Cambiar contraseña"
        description="Por seguridad, confirma tu contraseña actual"
      />

      <ChangePasswordForm backToHref="/dashboard/profile" />
    </PageContainer>
  )
}


