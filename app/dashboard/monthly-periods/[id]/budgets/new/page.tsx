import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { findManyCategories } from "@/app/actions/categories"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewMonthlyBudgetForm } from "../components/new-monthly-budget-form"
import { humanizeMonth } from "@/utils/helpers/humanize-month"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NewMonthlyBudgetPage(props: Props) {
  const { id } = await props.params

  const period = await findMonthlyPeriod(id)
  if (period.status === "error" || !period.data) {
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
          label: "Regresar a presupuestos",
        }}
        tabs={{
          general: {
            href: `/dashboard/monthly-periods/${id}`,
            label: "General",
          },
          budgets: {
            href: `/dashboard/monthly-periods/${id}/budgets`,
            label: "Presupuestos",
          },
        }}
        title={`Nuevo presupuesto - ${humanizeMonth(period.data.month)}`}
      />
      <NewMonthlyBudgetForm
        backToHref={BACK_TO_HREF}
        monthlyPeriodId={id}
        categories={categories}
      />
    </PageContainer>
  )
}

