import { notFound } from "next/navigation"
import { findManyAccounts } from "@/app/actions/accounts"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewTransferForm } from "../components/new-transfer-form"
import { getServerI18n } from "@/utils/i18n/server"

export default async function NewTransferPage() {
  const { t } = await getServerI18n()
  // Obtener todas las cuentas para los selectores
  const accountsResult = await findManyAccounts({
    page: 1,
    limit: 100,
    pagination: false,
  })

  if (accountsResult.status === "error" || !accountsResult.data) {
    return notFound()
  }

  const accounts = accountsResult.data.data

  if (accounts.length < 2) {
    return (
      <PageContainer>
        <PageHeader
          backTo={{
            href: "/dashboard/transfers",
            label: t("transfers.backToList"),
          }}
          title={t("transfers.newTitle")}
        />
        <div className="p-6">
          <p className="text-muted-foreground">
            {t("transfers.new.needTwoAccounts")}
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/transfers",
          label: t("transfers.backToList"),
        }}
        title={t("transfers.newTitle")}
      />
      <NewTransferForm accounts={accounts} backToHref="/dashboard/transfers" />
    </PageContainer>
  )
}

