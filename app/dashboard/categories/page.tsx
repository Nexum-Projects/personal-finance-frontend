import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyCategories } from "@/app/actions/categories"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { CategoriesTable } from "./components/categories-table"
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
    categoryType?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function CategoriesPage(props: Props) {
  const { t } = await getServerI18n()
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const result = await findManyCategories({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "name" | "categoryType",
    search: parsedParams.search,
    categoryType: parsedParams.categoryType,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("categories.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("categories.subtitle")}
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("categories.errorTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || t("categories.errorLoad")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: categories, meta } = result.data

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("categories.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("categories.subtitle")}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("categories.new")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("categories.listTitle")}</CardTitle>
            <CardDescription>
              {t("categories.listSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>{t("common.loading")}</div>}>
              <CategoriesTable categories={categories} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

