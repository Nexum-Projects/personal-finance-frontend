import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyAccounts } from "@/app/actions/accounts"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { AccountsTable } from "./components/accounts-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServerI18n } from "@/utils/i18n/server"

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

export default async function AccountsPage(props: Props) {
  const { t } = await getServerI18n()
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const result = await findManyAccounts({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "name" | "accountType" | "currentBalanceCents",
    search: parsedParams.search,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("accounts.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("accounts.subtitle")}
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("accounts.errorTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || t("accounts.errorLoad")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: accounts, meta } = result.data

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("accounts.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("accounts.subtitle")}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/accounts/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("accounts.new")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("accounts.listTitle")}</CardTitle>
            <CardDescription>
              {t("accounts.listSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <AccountsTable accounts={accounts} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


