import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findAccount } from "@/app/actions/accounts"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { DetailAccountActions } from "./components/detail-account-actions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { humanizeAccountType } from "@/utils/helpers/humanize-account-type"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { timeZoneToIana } from "@/utils/user-preferences"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return {
      title: "Cuenta no encontrada",
    }
  }

  return {
    title: account.data.name,
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

export default async function AccountDetailPage(props: Props) {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)

  const account = await findAccount(id)
  if (account.status === "error" || !account.data) {
    return notFound()
  }

  const acc = account.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailAccountActions account={acc} />}
        backTo={{
          href: "/dashboard/accounts",
          label: "Regresar a cuentas",
        }}
        title={acc.name}
      />

      <PageSection
        description="Información general de la cuenta"
        fields={{
          id: {
            label: "Identificador",
            value: acc.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          name: {
            label: "Nombre",
            value: acc.name,
          },
          accountType: {
            label: "Tipo",
            value: humanizeAccountType(acc.accountType),
          },
          currentBalance: {
            label: "Balance actual",
            value: formatAmount(acc.currentBalanceCents, preferences.preferredCurrency),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(acc.createdAt, timeZoneIana),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(acc.updatedAt, timeZoneIana),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}


