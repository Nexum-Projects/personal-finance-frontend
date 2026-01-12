import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { EditMonthlyPeriodForm } from "../../components/edit-monthly-period-form"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { centsToDecimal } from "@/utils/helpers/format-amount"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params

  const period = await findMonthlyPeriod(id)

  if (period.status === "error" || !period.data) {
    return {
      title: "Presupuesto mensual no encontrado",
    }
  }

    return {
      title: `Editar ahorro inicial - ${humanizeMonth(period.data.month)}`,
    }
}

export default async function EditMonthlyPeriodPage(props: Props) {
  const { id } = await props.params

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
          label: "Regresar al detalle",
        }}
        title={`Editar ahorro inicial - ${humanizeMonth(monthlyPeriod.month)}`}
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
