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

export default async function AccountDetailPage(props: Props) {
  const { id } = await props.params

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
          currency: {
            label: "Moneda",
            value: acc.currency,
          },
          currentBalance: {
            label: "Balance actual",
            value: formatAmount(acc.currentBalanceCents, acc.currency),
          },
          createdAt: {
            label: "Fecha de creación",
            value: formatDate(acc.createdAt),
          },
          updatedAt: {
            label: "Última actualización",
            value: formatDate(acc.updatedAt),
          },
        }}
        title="Datos generales"
      />
    </PageContainer>
  )
}


