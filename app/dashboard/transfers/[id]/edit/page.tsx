import { notFound } from "next/navigation"
import { findTransfer } from "@/app/actions/transfers"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditTransferForm } from "../components/edit-transfer-form"
import { getServerI18n } from "@/utils/i18n/server"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditTransferPage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()

  const transferResult = await findTransfer(id)

  if (transferResult.status === "error" || !transferResult.data) {
    return notFound()
  }

  const transfer = transferResult.data

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: `/dashboard/transfers/${id}`,
          label: t("transfers.edit.backToDetail"),
        }}
        title={t("transfers.edit.title")}
      />
      <EditTransferForm
        transfer={transfer}
        backToHref={`/dashboard/transfers/${id}`}
      />
    </PageContainer>
  )
}

