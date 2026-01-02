"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { removeMonthlyBudget, reactivateMonthlyBudget } from "@/app/actions/monthly-budgets"
import { DataTableRowActions } from "@/components/dashboard/data-table-row-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"
import type { MonthlyBudget } from "@/app/actions/monthly-budgets/types"

type Props = {
  monthlyPeriodId: string
  budget: MonthlyBudget
}

export function MonthlyBudgetsRowActions({ monthlyPeriodId, budget }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar el presupuesto de{" "}
          <span className="text-foreground font-medium">{budget.category.name}</span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, desactivar presupuesto",
        cancel: "Cancelar",
      },
      title: "¿Desactivar presupuesto?",
    })
  }

  const handleReactivate = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas reactivar el presupuesto de{" "}
          <span className="text-foreground font-medium">{budget.category.name}</span>?
        </>
      ),
      onConfirm: onReactivate,
      actions: {
        confirm: "Sí, reactivar presupuesto",
        cancel: "Cancelar",
      },
      title: "¿Reactivar presupuesto?",
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
          result.errors[0] || "Error al eliminar el presupuesto"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Presupuesto desactivado", {
        description: (
          <>
            El presupuesto de{" "}
            <span className="text-foreground font-medium">{budget.category.name}</span>{" "}
            ha sido desactivado exitosamente.
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
          result.errors[0] || "Error al reactivar el presupuesto"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Presupuesto reactivado", {
        description: (
          <>
            El presupuesto de{" "}
            <span className="text-foreground font-medium">{budget.category.name}</span>{" "}
            ha sido reactivado exitosamente.
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
        Editar presupuesto
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {budget.isActive ? (
        <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
          Desactivar presupuesto
        </DataTableRowActions.Item>
      ) : (
        <DataTableRowActions.Item type="button" onClick={handleReactivate}>
          Reactivar presupuesto
        </DataTableRowActions.Item>
      )}
    </DataTableRowActions>
  )
}

