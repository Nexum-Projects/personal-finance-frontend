import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyAccounts } from "@/app/actions/accounts"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { AccountsTable } from "./components/accounts-table"
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

export default async function AccountsPage(props: Props) {
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
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Cuentas</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus cuentas
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || "Error al cargar las cuentas"}
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
            <h1 className="text-3xl font-bold text-foreground">Cuentas</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus cuentas
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/accounts/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva cuenta
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cuentas</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todas tus cuentas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <AccountsTable accounts={accounts} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


