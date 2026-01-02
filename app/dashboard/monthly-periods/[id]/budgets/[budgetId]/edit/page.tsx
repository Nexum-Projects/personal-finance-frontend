import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { findMonthlyBudget } from "@/app/actions/monthly-budgets"
import { findManyCategories } from "@/app/actions/categories"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditMonthlyBudgetForm } from "../../components/edit-monthly-budget-form"
import { humanizeMonth } from "@/utils/helpers/humanize-month"

type Props = {
  params: Promise<{
    id: string
    budgetId: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id, budgetId } = await props.params

  const period = await findMonthlyPeriod(id)
  const budget = await findMonthlyBudget(budgetId)

  if (period.status === "error" || !period.data || budget.status === "error" || !budget.data) {
    return {
      title: "Presupuesto no encontrado",
    }
  }

  return {
    title: `Editar presupuesto - ${humanizeMonth(period.data.month)}`,
  }
}

export default async function EditMonthlyBudgetPage(props: Props) {
  const { id, budgetId } = await props.params

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
        title={`Editar presupuesto - ${humanizeMonth(period.data.month)}`}
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

