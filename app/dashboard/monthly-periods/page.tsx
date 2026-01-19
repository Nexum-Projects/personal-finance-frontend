import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyMonthlyPeriods } from "@/app/actions/monthly-periods"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { MonthlyPeriodsTable } from "./components/monthly-periods-table"
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

export default async function MonthlyPeriodsPage(props: Props) {
  const { t } = await getServerI18n()
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const result = await findManyMonthlyPeriods({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "year" | "month",
    search: parsedParams.search,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <PageContainer>
        <PageHeader title={t("monthlyPeriods.title")} description={t("monthlyPeriods.subtitle")} />
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyPeriods.errorTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {result.errors[0]?.message || t("monthlyPeriods.errorLoad")}
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const { data: monthlyPeriods, meta } = result.data

  return (
    <PageContainer>
      <PageHeader
        title={t("monthlyPeriods.title")}
        description={t("monthlyPeriods.subtitle")}
        actions={
          <Button asChild>
            <Link href="/dashboard/monthly-periods/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("monthlyPeriods.actions.new")}
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("monthlyPeriods.listTitle")}</CardTitle>
          <CardDescription>{t("monthlyPeriods.listSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <MonthlyPeriodsTable monthlyPeriods={monthlyPeriods} meta={meta} />
          </Suspense>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

