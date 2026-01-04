import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransfer } from "@/app/actions/transfers"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { DetailTransferActions } from "./components/detail-transfer-actions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const transfer = await findTransfer(id)

  if (transfer.status === "error" || !transfer.data) {
    return {
      title: "Transferencia no encontrada",
    }
  }

  return {
    title: `Transferencia: ${transfer.data.fromAccount.name} → ${transfer.data.toAccount.name}`,
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

export default async function TransferDetailPage(props: Props) {
  const { id } = await props.params

  const transfer = await findTransfer(id)
  if (transfer.status === "error" || !transfer.data) {
    return notFound()
  }

  const t = transfer.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailTransferActions transfer={t} />}
        backTo={{
          href: "/dashboard/transfers",
          label: "Regresar a transferencias",
        }}
        title={`${t.fromAccount.name} → ${t.toAccount.name}`}
      />

      <PageSection
        description="Información general de la transferencia"
        fields={{
          id: {
            label: "Identificador",
            value: t.id,
            classNames: {
              value: "font-mono",
            },
          },
          fromAccount: {
            label: "Cuenta de Origen",
            value: t.fromAccount.name,
          },
          toAccount: {
            label: "Cuenta de Destino",
            value: t.toAccount.name,
          },
          amount: {
            label: "Monto",
            value: formatAmount(t.amountCents, "GT"),
          },
          description: {
            label: "Descripción",
            value: t.description,
          },
          transferDate: {
            label: "Fecha de Transferencia",
            value: formatDateOnlyShort(t.transferDate),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(t.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(t.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

