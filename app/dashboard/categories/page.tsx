import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { findManyCategories } from "@/app/actions/categories"
import { parseSearchParams } from "@/utils/parsers/parse-search-params"
import { CategoriesTable } from "./components/categories-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  searchParams: Promise<{
    page?: string
    limit?: string
    order?: string
    orderBy?: string
    search?: string
    categoryType?: string
  }>
}

export default async function CategoriesPage(props: Props) {
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
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus categorías de gastos e ingresos
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                {result.errors[0]?.message || "Error al cargar las categorías"}
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
            <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus categorías de gastos e ingresos
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva categoría
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Categorías</CardTitle>
            <CardDescription>
              Aquí podrás ver y gestionar todas tus categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <CategoriesTable categories={categories} meta={meta} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

