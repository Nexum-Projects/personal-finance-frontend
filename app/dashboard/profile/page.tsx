import { notFound } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import { PREFERRED_CURRENCY_LABEL, PREFERRED_LANGUAGE_LABEL, languageToLocale, timeZoneToIana } from "@/utils/user-preferences"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { cn } from "@/lib/utils"
import { KeyRound, Pencil } from "lucide-react"
import { getServerI18n } from "@/utils/i18n/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n()
  return { title: t("profile.meta.title") }
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

export default async function ProfilePage() {
  const { t, language } = await getServerI18n()
  const user = await getCurrentUser()

  // Si no hay usuario, mostrar 404
  // (Si hay un error de autenticación, handleAuthErrorServer ya redirigió al login)
  if (!user) {
    return notFound()
  }

  const timeZoneIana = timeZoneToIana(user.timeZone)
  const locale = languageToLocale(user.preferredLanguage)

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard",
          label: t("profile.backToDashboard"),
        }}
        title={user.username}
        actions={{
          edit: {
            type: "link",
            href: "/dashboard/profile/edit",
            label: t("profile.actions.editUser"),
            icon: Pencil,
          },
          changePassword: {
            type: "link",
            href: "/dashboard/profile/change-password",
            label: t("profile.actions.changePassword"),
            icon: KeyRound,
            variant: "outline",
          },
        }}
      />
      <PageSection
        description={t("profile.section.description")}
        fields={{
          id: {
            label: t("profile.fields.id"),
            value: user.id,
            classNames: {
              value: cn("font-mono"),
            },
          },
          username: {
            label: t("profile.fields.username"),
            value: user.username,
          },
          email: {
            label: t("profile.fields.email"),
            value: user.email,
          },
          role: {
            label: t("profile.fields.role"),
            value: humanizeRole(user.role, language),
          },
          preferredCurrency: {
            label: t("profile.fields.preferredCurrency"),
            value: PREFERRED_CURRENCY_LABEL[user.preferredCurrency],
          },
          timeZone: {
            label: t("profile.fields.timeZone"),
            value: timeZoneIana,
          },
          preferredLanguage: {
            label: t("profile.fields.preferredLanguage"),
            value: PREFERRED_LANGUAGE_LABEL[user.preferredLanguage],
          },
          isActive: {
            label: t("profile.fields.status"),
            value: user.isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                {t("profile.status.active")}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                {t("profile.status.inactive")}
              </span>
            ),
          },
          createdAt: {
            label: t("profile.fields.createdAt"),
            value: formatDate(user.createdAt, locale, timeZoneIana),
          },
          updatedAt: {
            label: t("profile.fields.updatedAt"),
            value: formatDate(user.updatedAt, locale, timeZoneIana),
          },
        }}
        title={t("profile.section.title")}
      />
    </PageContainer>
  )
}
