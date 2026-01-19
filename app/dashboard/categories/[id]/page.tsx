import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findCategory } from "@/app/actions/categories"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { DetailCategoryActions } from "./components/detail-category-actions"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { getMessages } from "@/utils/i18n/messages"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const messages = getMessages(preferences.preferredLanguage)

  const category = await findCategory(id)

  if (category.status === "error" || !category.data) {
    return {
      title: messages["categories.detail.notFound"],
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
  const preferences = await getSessionPreferences()
  const messages = getMessages(preferences.preferredLanguage)
  const t = (key: keyof typeof messages) => messages[key]

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
          label: t("categories.backToList"),
        }}
        title={cat.name}
      />
      <PageSection
        description={t("categories.detail.sectionSubtitle")}
        fields={{
          id: {
            label: t("categories.detail.id"),
            value: cat.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          name: {
            label: t("categories.detail.name"),
            value: cat.name,
          },
          categoryType: {
            label: t("categories.detail.type"),
            value: humanizeCategoryType(cat.categoryType, preferences.preferredLanguage),
          },
          isActive: {
            label: t("categories.detail.status"),
            value: cat.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                {t("categories.detail.active")}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                {t("categories.detail.inactive")}
              </span>
            ),
          },
          createdAt: {
            label: t("categories.detail.createdAt"),
            value: formatDate(cat.createdAt),
          },
          updatedAt: {
            label: t("categories.detail.updatedAt"),
            value: formatDate(cat.updatedAt),
          },
        }}
        title={t("categories.detail.sectionTitle")}
      />
    </PageContainer>
  )
}

