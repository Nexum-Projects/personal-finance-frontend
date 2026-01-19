import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { EditMonthlyPeriodForm } from "../../components/edit-monthly-period-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { centsToDecimal } from "@/utils/helpers/format-amount"
import { getServerI18n } from "@/utils/i18n/server"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { languageToLocale } from "@/utils/user-preferences"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const { t } = await getServerI18n()

  const period = await findMonthlyPeriod(id)

  if (period.status === "error" || !period.data) {
    return {
      title: t("monthlyPeriods.detail.notFound"),
    }
  }

  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)
  return {
    title: t("monthlyPeriods.editInitialSaving.title", {
      month: humanizeMonth(period.data.month, locale),
    }),
  }
}

export default async function EditMonthlyPeriodPage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)

  const period = await findMonthlyPeriod(id)

  if (period.status === "error" || !period.data) {
    return notFound()
  }

  const monthlyPeriod = period.data

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: `/dashboard/monthly-periods/${id}`,
          label: t("monthlyPeriods.editInitialSaving.backToDetail"),
        }}
        title={t("monthlyPeriods.editInitialSaving.title", {
          month: humanizeMonth(monthlyPeriod.month, locale),
        })}
      />
      <EditMonthlyPeriodForm
        defaultValues={{
          initialSavingCents: centsToDecimal(monthlyPeriod.initialSavingCents),
        }}
        monthlyPeriodId={monthlyPeriod.id}
        backToHref={`/dashboard/monthly-periods/${id}`}
      />
    </PageContainer>
  )
}
