import { cache } from "react"
import { notFound } from "next/navigation"
import { findUser } from "@/app/actions/users"
import { humanizeRole } from "@/utils/helpers/humanize-role"
import {
  PREFERRED_CURRENCY_LABEL,
  PREFERRED_LANGUAGE_LABEL,
  languageToLocale,
  timeZoneToIana,
} from "@/utils/user-preferences"
import { PageContainer } from "@/components/display/containers/page-container"
import { PageHeader } from "@/components/display/page-header/page-header"
import { PageSection } from "@/components/display/page-section/page-section"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getServerI18n } from "@/utils/i18n/server"
import type { Metadata } from "next"
import { AdminUserStatusButtons } from "../components/admin-user-status-buttons"

const loadUserDetail = cache(async (userId: string) => {
  return findUser(userId)
})

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

type Props = {
  params: Promise<{ userId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { userId } = await props.params
  const result = await loadUserDetail(userId)
  const { t } = await getServerI18n()

  if (result.status === "success") {
    return {
      title: `${result.data.username} · ${t("admin.meta.title")}`,
    }
  }

  return { title: t("admin.users.detail.metaNotFound") }
}

export default async function AdminUserDetailPage(props: Props) {
  const { userId } = await props.params
  const { t, language } = await getServerI18n()
  const result = await loadUserDetail(userId)

  if (result.status === "error") {
    const code = result.errors[0]?.statusCode
    if (code === 404) {
      notFound()
    }

    return (
      <PageContainer>
        <PageHeader
          title={t("admin.users.title")}
          backTo={{
            href: "/dashboard/admin/users",
            label: t("admin.users.detail.backToList"),
          }}
        />
        <Card>
          <CardHeader>
            <CardTitle>{result.errors[0]?.title}</CardTitle>
            <CardDescription>{result.errors[0]?.message}</CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    )
  }

  const user = result.data
  const timeZoneIana = timeZoneToIana(user.timeZone)
  const locale = languageToLocale(user.preferredLanguage)

  return (
    <PageContainer>
      <PageHeader
        backTo={{
          href: "/dashboard/admin/users",
          label: t("admin.users.detail.backToList"),
        }}
        title={user.username}
        description={user.email}
        actions={
          <AdminUserStatusButtons userId={user.id} isActive={user.isActive} layout="detail" />
        }
      />

      <PageSection
        description={t("admin.users.detail.section.description")}
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
          emailVerifiedAt: {
            label: t("admin.users.fields.emailVerifiedAt"),
            value:
              user.emailVerifiedAt != null && user.emailVerifiedAt !== "" ? (
                formatDate(user.emailVerifiedAt, locale, timeZoneIana)
              ) : (
                <span className="text-muted-foreground">{t("admin.users.emailNotVerified")}</span>
              ),
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
              <span className="text-red-600 dark:text-red-400">{t("profile.status.inactive")}</span>
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
        title={t("admin.users.detail.section.title")}
      />
    </PageContainer>
  )
}
