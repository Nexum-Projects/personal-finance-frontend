import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransfer } from "@/app/actions/transfers"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { DetailTransferActions } from "./components/detail-transfer-actions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { timeZoneToIana } from "@/utils/user-preferences"

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

export default async function TransferDetailPage(props: Props) {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)

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
            value: formatAmount(t.amountCents, preferences.preferredCurrency),
          },
          description: {
            label: "Descripción",
            value: t.description,
          },
          transferDate: {
            label: "Fecha de Transferencia",
            value: formatDateOnlyShort(t.transferDate, timeZoneIana),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(t.createdAt, timeZoneIana),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(t.updatedAt, timeZoneIana),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}

