import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { findManyMonthlyBudgets } from "@/app/actions/monthly-budgets"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { MonthlyBudgetsTable } from "./components/monthly-budgets-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { getServerI18n } from "@/utils/i18n/server"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { languageToLocale } from "@/utils/user-preferences"

type Props = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    page?: string
    limit?: string
    order?: string
    orderBy?: string
    search?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const period = await findMonthlyPeriod(id)

  if (period.status === "error" || !period.data) {
    return {
      title: t("monthlyPeriods.detail.notFound"),
    }
  }

  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)

  return {
    title: t("monthlyPeriods.budgets.metaTitle", { month: humanizeMonth(period.data.month, locale) }),
  }
}

export default async function MonthlyPeriodBudgetsPage(props: Props) {
  const { id } = await props.params
  const searchParams = await props.searchParams
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)

  const period = await findMonthlyPeriod(id)
  if (period.status === "error" || !period.data) {
    return notFound()
  }

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const budgetsResult = await findManyMonthlyBudgets({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "budgetedCents",
    search: parsedParams.search,
    monthlyPeriodId: id,
    pagination: true,
  })

  if (budgetsResult.status === "error") {
    return (
      <PageContainer>
        <PageHeader
          backTo={{
            href: `/dashboard/monthly-periods/${id}`,
            label: t("monthlyPeriods.budgets.backToDetail"),
          }}
          tabs={{
            general: {
              href: `/dashboard/monthly-periods/${id}`,
              label: t("monthlyPeriods.tabs.general"),
            },
            budgets: {
              href: `/dashboard/monthly-periods/${id}/budgets`,
              label: t("monthlyPeriods.tabs.budgets"),
            },
          }}
          title={humanizeMonth(period.data.month, locale)}
        />
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyPeriods.errorTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {budgetsResult.errors[0]?.message || t("monthlyPeriods.budgets.errorLoad")}
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const { data: budgets, meta } = budgetsResult.data

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: `/dashboard/monthly-periods/${id}`,
          label: t("monthlyPeriods.budgets.backToDetail"),
        }}
        tabs={{
          general: {
            href: `/dashboard/monthly-periods/${id}`,
            label: t("monthlyPeriods.tabs.general"),
          },
          budgets: {
            href: `/dashboard/monthly-periods/${id}/budgets`,
            label: t("monthlyPeriods.tabs.budgets"),
          },
        }}
        title={humanizeMonth(period.data.month, locale)}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("monthlyPeriods.budgets.sectionTitle")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("monthlyPeriods.budgets.sectionSubtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/monthly-periods/${id}/budgets/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t("monthlyPeriods.budgets.actions.new")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("monthlyPeriods.budgets.listTitle")}</CardTitle>
          <CardDescription>
            {t("monthlyPeriods.budgets.listSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>{t("common.loading")}</div>}>
            <MonthlyBudgetsTable
              monthlyPeriodId={id}
              budgets={budgets}
              meta={meta}
            />
          </Suspense>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

