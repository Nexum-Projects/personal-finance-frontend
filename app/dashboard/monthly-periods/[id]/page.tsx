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
import { timeZoneToIana } from "@/utils/user-preferences"

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
      title: humanizeMonth(period.data.month),
    }
}

function formatDate(dateString: string, timeZone: string): string {
  try {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat("es-GT", {
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
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)

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
          label: "Regresar a presupuestos mensuales",
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
        description="Información general del presupuesto mensual"
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
            value: formatAmount(monthlyPeriod.initialSavingCents, preferences.preferredCurrency),
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
            value: formatDate(monthlyPeriod.createdAt, timeZoneIana),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(monthlyPeriod.updatedAt, timeZoneIana),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

