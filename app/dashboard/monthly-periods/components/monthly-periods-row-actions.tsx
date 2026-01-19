"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeMonthlyPeriod, reactivateMonthlyPeriod } from "@/app/actions/monthly-periods"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { MonthlyPeriod } from "@/app/actions/monthly-periods/types"
import { humanizeMonth } from "@/utils/helpers/humanize-month"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"

type Props = {
  monthlyPeriod: MonthlyPeriod
}

export function MonthlyPeriodsRowActions({ monthlyPeriod }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()
  const { t } = useI18n()
  const { locale } = useUserPreferences()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          {t("monthlyPeriods.confirmDeactivate.title")}{" "}
          <span className="text-foreground font-medium">
            {humanizeMonth(monthlyPeriod.month, locale)}
          </span>?
          {t("monthlyPeriods.confirmDeactivate.description")}
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: t("monthlyPeriods.confirmDeactivate.confirm"),
        cancel: t("monthlyPeriods.confirmDeactivate.cancel"),
      },
      title: t("monthlyPeriods.confirmDeactivate.title"),
    })
  }

  const handleReactivate = () => {
    confirmationDialog({
      description: (
        <>
          {t("monthlyPeriods.confirmReactivate.title")}{" "}
          <span className="text-foreground font-medium">
            {humanizeMonth(monthlyPeriod.month, locale)}
          </span>?
        </>
      ),
      onConfirm: onReactivate,
      actions: {
        confirm: t("monthlyPeriods.confirmReactivate.confirm"),
        cancel: t("monthlyPeriods.confirmReactivate.cancel"),
      },
      title: t("monthlyPeriods.confirmReactivate.title"),
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeMonthlyPeriod(monthlyPeriod.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.errorDeactivate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.monthlyPeriod.deactivated"), {
        description: (
          <>
            {t("toast.monthlyPeriod.deactivated.desc", {
              month: humanizeMonth(monthlyPeriod.month, locale),
            })}
          </>
        ),
      })
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
    }
  }

  const onReactivate = async () => {
    try {
      const result = await reactivateMonthlyPeriod(monthlyPeriod.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.errorReactivate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.monthlyPeriod.reactivated"), {
        description: (
          <>
            {t("toast.monthlyPeriod.reactivated.desc", {
              month: humanizeMonth(monthlyPeriod.month, locale),
            })}
          </>
        ),
      })
      router.refresh()
    } catch (error) {
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
    }
  }

  return (
    <DataTableRowActions>
      <DataTableRowActions.Item href={`/dashboard/monthly-periods/${monthlyPeriod.id}`} type="link">
        {t("monthlyPeriods.actions.view")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {monthlyPeriod.isActive ? (
        <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
          {t("monthlyPeriods.actions.deactivate")}
        </DataTableRowActions.Item>
      ) : (
        <DataTableRowActions.Item type="button" onClick={handleReactivate}>
          {t("monthlyPeriods.actions.reactivate")}
        </DataTableRowActions.Item>
      )}
    </DataTableRowActions>
  )
}

