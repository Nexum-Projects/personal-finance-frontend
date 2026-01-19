import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyTransfers } from "@/app/actions/transfers"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { TransfersTable } from "./components/transfers-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServerI18n } from "@/utils/i18n/server"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"

type Props = {
  searchParams: Promise<{
    page?: string
    limit?: string
    order?: string
    orderBy?: string
    search?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function TransfersPage(props: Props) {
  const { t } = await getServerI18n()
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const result = await findManyTransfers({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "transferDate" | "amountCents",
    search: parsedParams.search,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <PageContainer>
        <PageHeader title={t("transfers.title")} description={t("transfers.subtitle")} />
        <Card>
          <CardHeader>
            <CardTitle>{t("transfers.errorTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {result.errors[0]?.message || t("transfers.errorLoad")}
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const { data: transfers, meta } = result.data

  return (
    <PageContainer>
      <PageHeader
        title={t("transfers.title")}
        description={t("transfers.subtitle")}
        actions={
          <Button asChild>
            <Link href="/dashboard/transfers/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("transfers.actions.new")}
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("transfers.listTitle")}</CardTitle>
          <CardDescription>{t("transfers.listSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <TransfersTable transfers={transfers} meta={meta} />
          </Suspense>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

