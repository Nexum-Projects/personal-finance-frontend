import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyTransactions } from "@/app/actions/transactions"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { TransactionsTable } from "../expenses/components/transactions-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  searchParams: Promise<{
    page?: string
    limit?: string
    order?: string
    orderBy?: string
    search?: string
  }>
}

export default async function IncomePage(props: Props) {
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  const result = await findManyTransactions({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "transactionDate" | "amountCents",
    search: parsedParams.search,
    categoryType: "INCOME",
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Ingresos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus ingresos
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || "Error al cargar los ingresos"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: transactions, meta } = result.data

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ingresos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus ingresos
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/income/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo ingreso
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Ingresos</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todos tus ingresos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <TransactionsTable 
                transactions={transactions} 
                meta={meta} 
                categoryType="INCOME"
                basePath="/dashboard/income"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
