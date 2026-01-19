import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewMonthlyPeriodForm } from "../components/new-monthly-period-form"
import { getServerI18n } from "@/utils/i18n/server"

const BACK_TO_HREF = "/dashboard/monthly-periods"

export default async function NewMonthlyPeriodPage() {
  const { t } = await getServerI18n()
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("monthlyPeriods.backToList"),
        }}
        title={t("monthlyPeriods.newTitle")}
      />
      <NewMonthlyPeriodForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

