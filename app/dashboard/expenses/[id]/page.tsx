import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransaction } from "@/app/actions/transactions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { DetailTransactionActions } from "./components/detail-transaction-actions"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { timeZoneToIana } from "@/utils/user-preferences"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return {
      title: "Transacción no encontrada",
    }
  }

  return {
    title: transaction.data.description,
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

export default async function ExpenseDetailPage(props: Props) {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return notFound()
  }

  const trans = transaction.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailTransactionActions transaction={trans} categoryType="EXPENSE" />}
        backTo={{
          href: "/dashboard/expenses",
          label: "Regresar a gastos",
        }}
        title={trans.description}
      />
      <PageSection
        description="Información general del gasto"
        fields={{
          id: {
            label: "Identificador",
            value: trans.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          amount: {
            label: "Monto",
            value: formatAmount(trans.amountCents, preferences.preferredCurrency),
          },
          description: {
            label: "Descripción",
            value: trans.description,
          },
          category: {
            label: "Categoría",
            value: trans.category.name,
          },
          account: {
            label: "Cuenta",
            value: trans.account.name,
          },
          transactionDate: {
            label: "Fecha de Transacción",
            value: formatDateOnlyShort(trans.transactionDate, timeZoneIana),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(trans.createdAt, timeZoneIana),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(trans.updatedAt, timeZoneIana),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

