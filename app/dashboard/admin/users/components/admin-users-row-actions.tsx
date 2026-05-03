"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { activateUser, deactivateUser } from "@/app/actions/users"
import type { User } from "@/app/actions/users/types"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  user: User
}

export function AdminUsersRowActions({ user }: Props) {
  const router = useRouter()
  const { t } = useI18n()

  const detailHref = `/dashboard/admin/users/${user.id}`

  const handleActivate = async () => {
    try {
      const result = await activateUser(user.id)
      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) return
        toast.error(result.errors[0]?.message ?? t("admin.users.actions.error"))
        return
      }
      toast.success(t("admin.users.actions.successActivated"))
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)
      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, { description: humanizedError.description })
    }
  }

  const handleDeactivate = async () => {
    try {
      const result = await deactivateUser(user.id)
      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) return
        toast.error(result.errors[0]?.message ?? t("admin.users.actions.error"))
        return
      }
      toast.success(t("admin.users.actions.successDeactivated"))
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)
      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, { description: humanizedError.description })
    }
  }

  return (
    <DataTableRowActions>
      <DataTableRowActions.Item href={detailHref} type="link">
        {t("admin.users.actions.viewDetail")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {!user.isActive ? (
        <DataTableRowActions.Item type="button" onClick={() => void handleActivate()}>
          {t("admin.users.actions.activate")}
        </DataTableRowActions.Item>
      ) : (
        <DataTableRowActions.Item
          type="button"
          variant="destructive"
          onClick={() => void handleDeactivate()}
        >
          {t("admin.users.actions.deactivate")}
        </DataTableRowActions.Item>
      )}
    </DataTableRowActions>
  )
}
