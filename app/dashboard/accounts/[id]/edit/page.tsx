import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findAccount } from "@/app/actions/accounts"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditAccountForm } from "../components/edit-account-form"
import { getServerI18n } from "@/utils/i18n/server"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return {
      title: t("accounts.detail.notFound"),
    }
  }

  return {
    title: t("accounts.editTitle", { name: account.data.name }),
  }
}

export default async function EditAccountPage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return notFound()
  }

  const BACK_TO_HREF = "/dashboard/accounts"

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("accounts.backToList"),
        }}
        title={t("accounts.editTitle", { name: account.data.name })}
      />
      <EditAccountForm account={account.data} backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}
