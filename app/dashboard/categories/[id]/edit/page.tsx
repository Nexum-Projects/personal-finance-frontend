import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findCategory } from "@/app/actions/categories"
import { EditCategoryForm } from "../components/edit-category-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
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
    title: interpolate(messages["categories.editTitle"], { name: category.data.name }),
  }
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars[name]
    return v === undefined || v === null ? `{${name}}` : String(v)
  })
}

export default async function EditCategoryPage(props: Props) {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const messages = getMessages(preferences.preferredLanguage)
  const t = (key: keyof typeof messages) => messages[key]

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
          label: t("categories.backToList"),
        }}
        title={interpolate(t("categories.editTitle"), { name: category.data.name })}
      />
      <EditCategoryForm category={category.data} backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

