import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findCategory } from "@/app/actions/categories"
import { EditCategoryForm } from "../components/edit-category-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"

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
    title: `Editar ${category.data.name}`,
  }
}

export default async function EditCategoryPage(props: Props) {
  const { id } = await props.params

  const category = await findCategory(id)

  if (category.status === "error" || !category.data) {
    return notFound()
  }

  const BACK_TO_HREF = "/dashboard/categories"

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar a categorías",
        }}
        title={`Editar ${category.data.name}`}
      />
      <EditCategoryForm category={category.data} backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

