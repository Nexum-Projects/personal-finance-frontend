import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { NewMonthlyPeriodForm } from "../components/new-monthly-period-form"

const BACK_TO_HREF = "/dashboard/monthly-periods"

export default function NewMonthlyPeriodPage() {
  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: BACK_TO_HREF,
          label: "Regresar a presupuestos mensuales",
        }}
        title="Nuevo presupuesto mensual"
      />
      <NewMonthlyPeriodForm backToHref={BACK_TO_HREF} />
    </PageContainer>
  )
}

