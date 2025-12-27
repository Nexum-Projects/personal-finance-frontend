import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findCategory } from "@/app/actions/categories"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { DetailCategoryActions } from "./components/detail-category-actions"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params

  const category = await findCategory(id)

  if (category.status === "error" || !category.data) {
    return {
      title: "Categoría no encontrada",
    }
  }

  return {
    title: category.data.name,
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch {
    return dateString
  }
}

export default async function CategoryDetailPage(props: Props) {
  const { id } = await props.params

  const category = await findCategory(id)

  // Si hay un error de autenticación, handleAuthErrorServer ya redirigió al login
  // Si no hay datos, es un 404 (recurso no encontrado)
  if (category.status === "error" || !category.data) {
    return notFound()
  }

  const cat = category.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailCategoryActions category={cat} />}
        backTo={{
          href: "/dashboard/categories",
          label: "Regresar a categorías",
        }}
        title={cat.name}
      />
      <PageSection
        description="Información general de la categoría"
        fields={{
          id: {
            label: "Identificador",
            value: cat.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          name: {
            label: "Nombre",
            value: cat.name,
          },
          categoryType: {
            label: "Tipo de Categoría",
            value: humanizeCategoryType(cat.categoryType),
          },
          isActive: {
            label: "Estado",
            value: cat.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Activa
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                Inactiva
              </span>
            ),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(cat.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(cat.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

