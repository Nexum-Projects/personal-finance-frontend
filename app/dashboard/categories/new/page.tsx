import { NewCategoryForm } from "../components/new-category-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { getServerI18n } from "@/utils/i18n/server"

const BACK_TO_HREF = "/dashboard/categories"

export default async function NewCategoryPage() {
  const { t } = await getServerI18n()
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("categories.backToList"),
        }}
        title={t("categories.newTitle")}
      />
      <NewCategoryForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

