import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyTransactions } from "@/app/actions/transactions"
import { findManyCategories } from "@/app/actions/categories"
import { findManyAccounts } from "@/app/actions/accounts"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { AllTransactionsTable } from "./components/all-transactions-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    categoryId?: string
    accountId?: string
  }>
}

export default async function TransactionsPage(props: Props) {
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
  })

  // Cargar categorías y cuentas para los filtros
  const [categoriesResult, accountsResult] = await Promise.all([
    findManyCategories({ page: 1, limit: 5, pagination: false }),
    findManyAccounts({ page: 1, limit: 5, pagination: false }),
  ])

  const categories = categoriesResult.status === "success" ? categoriesResult.data.data : []
  const accounts = accountsResult.status === "success" ? accountsResult.data.data : []

  const result = await findManyTransactions({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "transactionDate" | "amountCents",
    search: parsedParams.search,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    categoryId: searchParams.categoryId,
    accountId: searchParams.accountId,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <PageContainer>
        <PageHeader
          title="Transacciones"
          description="Gestiona todas tus transacciones"
        />
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {result.errors[0]?.message || "Error al cargar las transacciones"}
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const { data: transactions, meta } = result.data

  return (
    <PageContainer>
      <PageHeader
        title="Transacciones"
        description="Gestiona todas tus transacciones"
        tabs={{
          all: {
            href: "/dashboard/transactions",
            label: "Todas",
          },
          income: {
            href: "/dashboard/transactions/income",
            label: "Ingresos",
          },
          expenses: {
            href: "/dashboard/transactions/expenses",
            label: "Gastos",
          },
        }}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/transactions/income/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo ingreso
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/transactions/expenses/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo gasto
              </Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>
            Aquí podrás ver y gestionar todas tus transacciones (ingresos y gastos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Cargando...</div>}>
            <AllTransactionsTable 
              transactions={transactions} 
              meta={meta} 
              basePath="/dashboard/transactions"
              categories={categories}
              accounts={accounts}
            />
          </Suspense>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

