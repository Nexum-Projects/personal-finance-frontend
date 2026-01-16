import getSession from "@/app/actions/auth/getSession"
import { DashboardShell } from "./components/dashboard-shell"
import { getPreferencesFromClaims } from "@/utils/user-preferences"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const preferences = getPreferencesFromClaims(session as Record<string, unknown> | null)

  return <DashboardShell preferences={preferences}>{children}</DashboardShell>
}
