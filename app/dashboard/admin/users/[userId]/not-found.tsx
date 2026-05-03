import Link from "next/link"
import { PageContainer } from "@/components/display/containers/page-container"
import { Button } from "@/components/ui/button"
import { getServerI18n } from "@/utils/i18n/server"

export default async function AdminUserNotFound() {
  const { t } = await getServerI18n()

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">{t("admin.users.detail.notFoundMessage")}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/users">{t("admin.users.detail.backToList")}</Link>
        </Button>
      </div>
    </PageContainer>
  )
}
