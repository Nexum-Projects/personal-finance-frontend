import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyMonthlyPeriods } from "@/app/actions/monthly-periods"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { MonthlyPeriodsTable } from "./components/monthly-periods-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Períodos Mensuales</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus períodos mensuales
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || "Error al cargar los períodos mensuales"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: monthlyPeriods, meta } = result.data

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Períodos Mensuales</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus períodos mensuales
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/monthly-periods/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo período mensual
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Períodos Mensuales</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todos tus períodos mensuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <MonthlyPeriodsTable monthlyPeriods={monthlyPeriods} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

