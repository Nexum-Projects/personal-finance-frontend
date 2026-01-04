import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyTransfers } from "@/app/actions/transfers"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { TransfersTable } from "./components/transfers-table"
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

export default async function TransfersPage(props: Props) {
  const searchParams = await props.searchParams

  const parsedParams = parseSearchParams(searchParams, {
    page: 1,
    limit: 10,
    order: "DESC",
    orderBy: "updatedAt",
    search: "",
    startDate: "",
    endDate: "",
  })

  const result = await findManyTransfers({
    page: parsedParams.page,
    limit: parsedParams.limit,
    order: parsedParams.order,
    orderBy: parsedParams.orderBy as "createdAt" | "updatedAt" | "transferDate" | "amountCents",
    search: parsedParams.search,
    startDate: parsedParams.startDate || undefined,
    endDate: parsedParams.endDate || undefined,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Transferencias</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus transferencias entre cuentas
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || "Error al cargar las transferencias"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: transfers, meta } = result.data

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transferencias</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus transferencias entre cuentas
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/transfers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva transferencia
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Transferencias</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todas tus transferencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <TransfersTable transfers={transfers} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

