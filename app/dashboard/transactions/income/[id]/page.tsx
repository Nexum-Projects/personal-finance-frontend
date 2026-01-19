import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransaction } from "@/app/actions/transactions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { DetailTransactionActions } from "../../../expenses/[id]/components/detail-transaction-actions"
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

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return {
      title: t("transactions.detail.notFound"),
    }
  }

  return {
    title: transaction.data.description,
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

export default async function TransactionIncomeDetailPage(props: Props) {
  const { id } = await props.params
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const locale = languageToLocale(preferences.preferredLanguage)

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
          href: "/dashboard/transactions/income",
          label: t("transactions.backToIncome"),
        }}
        title={trans.description}
      />
      <PageSection
        description={t("transactions.detail.income.subtitle")}
        fields={{
          id: {
            label: t("transactions.detail.id"),
            value: trans.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          amount: {
            label: t("transactions.detail.amount"),
            value: formatAmount(trans.amountCents, preferences.preferredCurrency),
          },
          description: {
            label: t("transactions.detail.description"),
            value: trans.description,
          },
          category: {
            label: t("transactions.detail.category"),
            value: trans.category.name,
          },
          account: {
            label: t("transactions.detail.account"),
            value: trans.account.name,
          },
          transactionDate: {
            label: t("transactions.detail.transactionDate"),
            value: formatDateOnlyShort(trans.transactionDate, timeZoneIana),
          },
          createdAt: {
            label: t("transactions.detail.createdAt"),
            value: formatDate(trans.createdAt, timeZoneIana, locale),
          },
          updatedAt: {
            label: t("transactions.detail.updatedAt"),
            value: formatDate(trans.updatedAt, timeZoneIana, locale),
          },
        }}
        title={t("transactions.detail.sectionTitle")}
      />
    </PageContainer>
  )
}

