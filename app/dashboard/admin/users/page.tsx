import { listUsers } from "@/app/actions/users"
import { parseAdminUsersSearchParams } from "@/utils/parsers/admin-users-search-params"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminUsersTable } from "./components/admin-users-table"
import { getServerI18n } from "@/utils/i18n/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n()
  return { title: t("admin.meta.title") }
}

type Props = {
  searchParams: Promise<{
    page?: string
    limit?: string
    order?: string
    orderBy?: string
    search?: string
  }>
}

export default async function AdminUsersPage(props: Props) {
  const { t } = await getServerI18n()
  const raw = await props.searchParams
  const parsed = parseAdminUsersSearchParams(raw)

  const result = await listUsers({
    page: parsed.page,
    limit: parsed.limit,
    order: parsed.order,
    orderBy: parsed.orderBy,
    search: parsed.search || undefined,
    pagination: true,
  })

  if (result.status === "error") {
    return (
      <PageContainer>
        <PageHeader title={t("admin.users.title")} description={t("admin.users.subtitle")} />
        <Card>
          <CardHeader>
            <CardTitle>{result.errors[0]?.title ?? t("admin.error.forbidden.title")}</CardTitle>
            <CardDescription>{result.errors[0]?.message}</CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    )
  }

  const { data: users, meta } = result.data

  return (
    <PageContainer>
      <PageHeader title={t("admin.users.title")} description={t("admin.users.subtitle")} />

      <AdminUsersTable users={users} meta={meta} />
    </PageContainer>
  )
}
