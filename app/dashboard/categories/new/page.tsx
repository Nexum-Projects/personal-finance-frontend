import { Metadata } from "next"
import { NewCategoryForm } from "../components/new-category-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"

export const metadata: Metadata = {
  title: "Nueva categoría",
}

const BACK_TO_HREF = "/dashboard/categories"

export default function NewCategoryPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar a categorías",
        }}
        title="Nueva categoría"
      />
      <NewCategoryForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

