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
import { languageToLocale, timeZoneToIana } from "@/utils/user-preferences"
import { getMessages } from "@/utils/i18n/messages"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const messages = getMessages(preferences.preferredLanguage)
  const account = await findAccount(id)

  if (account.status === "error" || !account.data) {
    return {
      title: messages["accounts.detail.notFound"],
    }
  }

  return {
    title: account.data.name,
  }
}

function formatDate(dateString: string, locale: string, timeZone: string): string {
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

export default async function AccountDetailPage(props: Props) {
  const { id } = await props.params
  const preferences = await getSessionPreferences()
  const timeZoneIana = timeZoneToIana(preferences.timeZone)
  const locale = languageToLocale(preferences.preferredLanguage)
  const messages = getMessages(preferences.preferredLanguage)
  const t = (key: keyof typeof messages) => messages[key]

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
          label: t("accounts.backToList"),
        }}
        title={acc.name}
      />

      <PageSection
        description={t("accounts.detail.sectionSubtitle")}
        fields={{
          id: {
            label: t("accounts.detail.id"),
            value: acc.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          name: {
            label: t("accounts.detail.name"),
            value: acc.name,
          },
          accountType: {
            label: t("accounts.detail.type"),
            value: humanizeAccountType(acc.accountType, preferences.preferredLanguage),
          },
          currentBalance: {
            label: t("accounts.detail.currentBalance"),
            value: formatAmount(acc.currentBalanceCents, preferences.preferredCurrency),
          },
          createdAt: {
            label: t("accounts.detail.createdAt"),
            value: formatDate(acc.createdAt, locale, timeZoneIana),
          },
          updatedAt: {
            label: t("accounts.detail.updatedAt"),
            value: formatDate(acc.updatedAt, locale, timeZoneIana),
          },
        }}
        title={t("accounts.detail.sectionTitle")}
      />
    </PageContainer>
  )
}


