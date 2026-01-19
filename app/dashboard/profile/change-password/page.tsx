import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { ChangePasswordForm } from "../components/change-password-form"
import { getServerI18n } from "@/utils/i18n/server"

export default async function ChangePasswordPage() {
  const { t } = await getServerI18n()
  const user = await getCurrentUser()
  if (!user) return notFound()

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/profile",
          label: t("profile.password.backToProfile"),
        }}
        title={t("profile.password.title")}
        description={t("profile.password.description")}
      />

      <ChangePasswordForm backToHref="/dashboard/profile" />
    </PageContainer>
  )
}


