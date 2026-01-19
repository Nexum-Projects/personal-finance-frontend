import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { findMonthlyBudget } from "@/app/actions/monthly-budgets"
import { findManyCategories } from "@/app/actions/categories"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditMonthlyBudgetForm } from "../../components/edit-monthly-budget-form"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { getServerI18n } from "@/utils/i18n/server"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { languageToLocale } from "@/utils/user-preferences"

type Props = {
  params: Promise<{
    id: string
    budgetId: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id, budgetId } = await props.params
  const { t } = await getServerI18n()

  const period = await findMonthlyPeriod(id)
  const budget = await findMonthlyBudget(budgetId)

  if (period.status === "error" || !period.data || budget.status === "error" || !budget.data) {
    return {
      title: t("monthlyPeriods.budgets.notFound"),
    }
  }

  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)

  return {
    title: t("monthlyPeriods.budgets.editTitle", { month: humanizeMonth(period.data.month, locale) }),
  }
}

export default async function EditMonthlyBudgetPage(props: Props) {
  const { id, budgetId } = await props.params
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const locale = languageToLocale(preferences.preferredLanguage)

  const period = await findMonthlyPeriod(id)
  const budget = await findMonthlyBudget(budgetId)

  if (period.status === "error" || !period.data || budget.status === "error" || !budget.data) {
    return notFound()
  }

  const categoriesResult = await findManyCategories({
    page: 1,
    limit: 100,
    pagination: false,
  })

  const categories = categoriesResult.status === "success" ? categoriesResult.data.data : []

  const BACK_TO_HREF = `/dashboard/monthly-periods/${id}/budgets`

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: t("monthlyPeriods.budgets.backToBudgets"),
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
        title={t("monthlyPeriods.budgets.editTitle", {
          month: humanizeMonth(period.data.month, locale),
        })}
      />
      <EditMonthlyBudgetForm
        budget={budget.data}
        backToHref={BACK_TO_HREF}
        monthlyPeriodId={id}
        categories={categories}
      />
    </PageContainer>
  )
}

