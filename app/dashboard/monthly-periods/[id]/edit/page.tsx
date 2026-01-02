import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findMonthlyPeriod } from "@/app/actions/monthly-periods"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { EditMonthlyPeriodForm } from "../components/edit-monthly-period-form"
import { humanizeMonth } from "@/utils/helpers/humanize-month"

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
      title: "Período mensual no encontrado",
    }
  }

  return {
    title: `Editar ${humanizeMonth(period.data.month)}`,
  }
}

export default async function EditMonthlyPeriodPage(props: Props) {
  const { id } = await props.params

  const period = await findMonthlyPeriod(id)

  if (period.status === "error" || !period.data) {
    return notFound()
  }

  const BACK_TO_HREF = `/dashboard/monthly-periods/${id}`

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar al detalle",
        }}
        title={`Editar ${humanizeMonth(period.data.month)}`}
      />
      <EditMonthlyPeriodForm monthlyPeriod={period.data} backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

