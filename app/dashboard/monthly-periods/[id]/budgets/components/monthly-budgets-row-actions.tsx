"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeMonthlyBudget, reactivateMonthlyBudget } from "@/app/actions/monthly-budgets"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  monthlyPeriodId: string
  budget: MonthlyBudget
}

export function MonthlyBudgetsRowActions({ monthlyPeriodId, budget }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()
  const { t } = useI18n()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          {t("monthlyPeriods.budgets.confirmDeactivate.title")}{" "}
          <span className="text-foreground font-medium">{budget.category.name}</span>?
          {t("monthlyPeriods.budgets.confirmDeactivate.description")}
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: t("monthlyPeriods.budgets.confirmDeactivate.confirm"),
        cancel: t("monthlyPeriods.budgets.confirmDeactivate.cancel"),
      },
      title: t("monthlyPeriods.budgets.confirmDeactivate.title"),
    })
  }

  const handleReactivate = () => {
    confirmationDialog({
      description: (
        <>
          {t("monthlyPeriods.budgets.confirmReactivate.title")}{" "}
          <span className="text-foreground font-medium">{budget.category.name}</span>?
        </>
      ),
      onConfirm: onReactivate,
      actions: {
        confirm: t("monthlyPeriods.budgets.confirmReactivate.confirm"),
        cancel: t("monthlyPeriods.budgets.confirmReactivate.cancel"),
      },
      title: t("monthlyPeriods.budgets.confirmReactivate.title"),
    })
  }

  const onRemove = async () => {
    try {
      const result = await removeMonthlyBudget(budget.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.budgets.errorDeactivate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.monthlyBudget.deactivated"), {
        description: (
          <>
            {t("toast.monthlyBudget.deactivated.desc", { category: budget.category.name })}
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
      const result = await reactivateMonthlyBudget(budget.id, monthlyPeriodId)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || t("monthlyPeriods.budgets.errorReactivate")
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success(t("toast.monthlyBudget.reactivated"), {
        description: (
          <>
            {t("toast.monthlyBudget.reactivated.desc", { category: budget.category.name })}
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
      <DataTableRowActions.Item
        href={`/dashboard/monthly-periods/${monthlyPeriodId}/budgets/${budget.id}/edit`}
        type="link"
      >
        {t("monthlyPeriods.budgets.actions.edit")}
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {budget.isActive ? (
        <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
          {t("monthlyPeriods.budgets.actions.deactivate")}
        </DataTableRowActions.Item>
      ) : (
        <DataTableRowActions.Item type="button" onClick={handleReactivate}>
          {t("monthlyPeriods.budgets.actions.reactivate")}
        </DataTableRowActions.Item>
      )}
    </DataTableRowActions>
  )
}

