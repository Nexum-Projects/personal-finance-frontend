import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { DetailMonthlyPeriodActions } from "./components/detail-monthly-period-actions"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { formatAmount } from "@/utils/helpers/format-amount"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { languageToLocale, timeZoneToIana } from "@/utils/user-preferences"
import { getServerI18n } from "@/utils/i18n/server"

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
    title: humanizeMonth(period.data.month, locale),
  }
}

function formatDate(dateString: string, timeZone: string, locale: string): string {
  try {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    return formatter.format(date)
  } catch {
    return dateString
  }
}

export default async function MonthlyPeriodDetailPage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const locale = languageToLocale(preferences.preferredLanguage)

  const period = await findMonthlyPeriod(id)
  if (period.status === "error" || !period.data) {
    return notFound()
  }

  const monthlyPeriod = period.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailMonthlyPeriodActions monthlyPeriod={monthlyPeriod} />}
        backTo={{
          href: "/dashboard/monthly-periods",
          label: t("monthlyPeriods.backToList"),
        }}
        tabs={{
          general: {
            href: `/dashboard/monthly-periods/${id}`,
            label: t("monthlyPeriods.tabs.general"),
          },
          budgets: {
            href: `/dashboard/monthly-periods/${id}/budgets`,
            label: t("monthlyPeriods.tabs.budgets"),
          },
        }}
        title={humanizeMonth(monthlyPeriod.month, locale)}
      />

      <PageSection
        description={t("monthlyPeriods.detail.subtitle")}
        fields={{
          id: {
            label: t("monthlyPeriods.detail.id"),
            value: monthlyPeriod.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          year: {
            label: t("monthlyPeriods.detail.year"),
            value: monthlyPeriod.year.toString(),
          },
          month: {
            label: t("monthlyPeriods.detail.month"),
            value: humanizeMonth(monthlyPeriod.month, locale),
          },
          initialSavingCents: {
            label: t("monthlyPeriods.detail.initialSaving"),
            value: formatAmount(monthlyPeriod.initialSavingCents, preferences.preferredCurrency),
          },
          isActive: {
            label: t("monthlyPeriods.detail.status"),
            value: monthlyPeriod.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                {t("monthlyPeriods.status.active")}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                {t("monthlyPeriods.status.inactive")}
              </span>
            ),
          },
          createdAt: {
            label: t("monthlyPeriods.detail.createdAt"),
            value: formatDate(monthlyPeriod.createdAt, timeZoneIana, locale),
          },
          updatedAt: {
            label: t("monthlyPeriods.detail.updatedAt"),
            value: formatDate(monthlyPeriod.updatedAt, timeZoneIana, locale),
          },
        }}
        title={t("monthlyPeriods.detail.sectionTitle")}
      />
    </PageContainer>
  )
}

