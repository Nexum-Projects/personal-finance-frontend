import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewAccountForm } from "../components/new-account-form"
import { getServerI18n } from "@/utils/i18n/server"

const BACK_TO_HREF = "/dashboard/accounts"

export default async function NewAccountPage() {
  const { t } = await getServerI18n()
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("accounts.backToList"),
        }}
        title={t("accounts.newTitle")}
      />
      <NewAccountForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}


