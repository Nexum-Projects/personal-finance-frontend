import { Metadata } from "next"
import { notFound } from "next/navigation"
import { findTransaction } from "@/app/actions/transactions"
import { formatAmount } from "@/utils/helpers/format-amount"
import { formatDateTime } from "@/utils/helpers/format-date-time"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { formatDateOnlyShort } from "@/utils/helpers/format-date-only"
import { DetailTransactionActions } from "./detail-transaction-actions"
import getSessionPreferences from "@/app/actions/auth/get-session-preferences"
import { languageToLocale, timeZoneToIana } from "@/utils/user-preferences"
import { getServerI18n } from "@/utils/i18n/server"

type CategoryType = "INCOME" | "EXPENSE"

const BY_TYPE = {
  EXPENSE: {
    href: "/dashboard/transactions/expenses",
    backLabel: "transactions.backToExpenses",
    subtitle: "transactions.detail.expense.subtitle",
  },
  INCOME: {
    href: "/dashboard/transactions/income",
    backLabel: "transactions.backToIncome",
    subtitle: "transactions.detail.income.subtitle",
  },
} as const

export async function generateTransactionMetadata(
  id: string
): Promise<Metadata> {
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

// Detalle compartido por las páginas de gasto e ingreso; solo cambian enlace y textos.
export async function TransactionDetail({
  id,
  categoryType,
}: Readonly<{
  id: string
  categoryType: CategoryType
}>) {
  const { t } = await getServerI18n()
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const locale = languageToLocale(preferences.preferredLanguage)
  const { href, backLabel, subtitle } = BY_TYPE[categoryType]

  const transaction = await findTransaction(id)

  if (transaction.status === "error" || !transaction.data) {
    return notFound()
  }

  const trans = transaction.data

  return (
    <PageContainer>
      <PageHeader
        actions={
          <DetailTransactionActions
            transaction={trans}
            categoryType={categoryType}
          />
        }
        backTo={{
          href,
          label: t(backLabel),
        }}
        title={trans.description}
      />
      <PageSection
        description={t(subtitle)}
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
            value: formatAmount(
              trans.amountCents,
              preferences.preferredCurrency
            ),
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
            value: formatDateTime(trans.createdAt, locale, timeZoneIana),
          },
          updatedAt: {
            label: t("transactions.detail.updatedAt"),
            value: formatDateTime(trans.updatedAt, locale, timeZoneIana),
          },
        }}
        title={t("transactions.detail.sectionTitle")}
      />
    </PageContainer>
  )
}
