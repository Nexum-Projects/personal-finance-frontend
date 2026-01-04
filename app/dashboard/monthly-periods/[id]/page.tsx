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
      title: humanizeMonth(period.data.month),
    }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch {
    return dateString
  }
}

export default async function MonthlyPeriodDetailPage(props: Props) {
  const { id } = await props.params

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
          label: "Regresar a períodos mensuales",
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
        title={humanizeMonth(monthlyPeriod.month)}
      />

      <PageSection
        description="Información general del período mensual"
        fields={{
          id: {
            label: "Identificador",
            value: monthlyPeriod.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          year: {
            label: "Año",
            value: monthlyPeriod.year.toString(),
          },
          month: {
            label: "Mes",
            value: humanizeMonth(monthlyPeriod.month),
          },
          initialSavingCents: {
            label: "Ahorro Inicial",
            value: formatAmount(monthlyPeriod.initialSavingCents, "GT"),
          },
          isActive: {
            label: "Estado",
            value: monthlyPeriod.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Activo
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                Inactivo
              </span>
            ),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(monthlyPeriod.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(monthlyPeriod.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

