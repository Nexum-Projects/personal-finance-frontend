import { redirect } from "next/navigation"
import getCurrentUser from "@/app/actions/users/get-current-user"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "SYSADMIN") {
    redirect("/dashboard")
  }

  return children
}
