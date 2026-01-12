import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransaction } from "@/app/actions/transactions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { DetailTransactionActions } from "../../expenses/[id]/components/detail-transaction-actions"

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

export default async function IncomeDetailPage(props: Props) {
  const { id } = await props.params

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return notFound()
  }

  const trans = transaction.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailTransactionActions transaction={trans} categoryType="INCOME" />}
        backTo={{
          href: "/dashboard/income",
          label: "Regresar a ingresos",
        }}
        title={trans.description}
      />
      <PageSection
        description="Información general del ingreso"
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
            value: formatAmount(trans.amountCents, "GT"),
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
            value: formatDateOnlyShort(trans.transactionDate),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(trans.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(trans.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

