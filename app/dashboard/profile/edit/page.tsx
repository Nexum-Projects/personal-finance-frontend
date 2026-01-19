import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditUsernameForm } from "../components/edit-username-form"
import { getServerI18n } from "@/utils/i18n/server"

export default async function EditProfilePage() {
  const { t } = await getServerI18n()
  const user = await getCurrentUser()
  if (!user) return notFound()

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/profile",
          label: t("profile.edit.backToProfile"),
        }}
        title={t("profile.edit.title")}
        description={t("profile.edit.description")}
      />

      <EditUsernameForm
        backToHref="/dashboard/profile"
        defaultValues={{
          username: user.username,
          preferredCurrency: user.preferredCurrency,
          preferredLanguage: user.preferredLanguage,
          timeZone: user.timeZone,
        }}
      />
    </PageContainer>
  )
}


