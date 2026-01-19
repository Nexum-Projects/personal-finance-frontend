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
import { languageToLocale, timeZoneToIana } from "@/utils/user-preferences"
import { getServerI18n } from "@/utils/i18n/server"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const transfer = await findTransfer(id)

  if (transfer.status === "error" || !transfer.data) {
    return {
      title: t("transfers.detail.notFound"),
    }
  }

  return {
    title: t("transfers.detail.title", {
      from: transfer.data.fromAccount.name,
      to: transfer.data.toAccount.name,
    }),
  }
}

function formatDate(dateString: string, timeZone: string, locale: string): string {
  try {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat(locale, {
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
  const { t: i18n } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const locale = languageToLocale(preferences.preferredLanguage)

  const transfer = await findTransfer(id)
  if (transfer.status === "error" || !transfer.data) {
    return notFound()
  }

  const transferData = transfer.data

  return (
    <PageContainer>
      <PageHeader
        actions={<DetailTransferActions transfer={transferData} />}
        backTo={{
          href: "/dashboard/transfers",
          label: i18n("transfers.backToList"),
        }}
        title={`${transferData.fromAccount.name} → ${transferData.toAccount.name}`}
      />

      <PageSection
        description={i18n("transfers.detail.subtitle")}
        fields={{
          id: {
            label: i18n("transfers.detail.id"),
            value: transferData.id,
            classNames: {
              value: "font-mono",
            },
          },
          fromAccount: {
            label: i18n("transfers.detail.fromAccount"),
            value: transferData.fromAccount.name,
          },
          toAccount: {
            label: i18n("transfers.detail.toAccount"),
            value: transferData.toAccount.name,
          },
          amount: {
            label: i18n("transfers.detail.amount"),
            value: formatAmount(transferData.amountCents, preferences.preferredCurrency),
          },
          description: {
            label: i18n("transfers.detail.description"),
            value: transferData.description,
          },
          transferDate: {
            label: i18n("transfers.detail.transferDate"),
            value: formatDateOnlyShort(transferData.transferDate, timeZoneIana),
          },
          createdAt: {
            label: i18n("transfers.detail.createdAt"),
            value: formatDate(transferData.createdAt, timeZoneIana, locale),
          },
          updatedAt: {
            label: i18n("transfers.detail.updatedAt"),
            value: formatDate(transferData.updatedAt, timeZoneIana, locale),
          },
        }}
        title={i18n("transfers.detail.sectionTitle")}
      />
    </PageContainer>
  )
}

