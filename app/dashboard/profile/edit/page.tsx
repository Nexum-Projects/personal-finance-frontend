import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditUsernameForm } from "../components/edit-username-form"

export default async function EditProfilePage() {
  const user = await getCurrentUser()
  if (!user) return notFound()

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/profile",
          label: "Regresar a mi perfil",
        }}
        title="Editar usuario"
        description="Actualiza tu nombre de usuario"
      />

      <EditUsernameForm
        backToHref="/dashboard/profile"
        defaultValues={{ username: user.username }}
      />
    </PageContainer>
  )
}


