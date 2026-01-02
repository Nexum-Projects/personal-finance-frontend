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

type Props = {
  monthlyPeriod: MonthlyPeriod
}

export function MonthlyPeriodsRowActions({ monthlyPeriod }: Props) {
  const router = useRouter()
  const { confirmationDialog } = useConfirmationDialogStore()

  const handleRemove = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar el período mensual{" "}
          <span className="text-foreground font-medium">
{humanizeMonth(monthlyPeriod.month)}
          </span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, desactivar período",
        cancel: "Cancelar",
      },
      title: "¿Desactivar período mensual?",
    })
  }

  const handleReactivate = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas reactivar el período mensual{" "}
          <span className="text-foreground font-medium">
{humanizeMonth(monthlyPeriod.month)}
          </span>?
        </>
      ),
      onConfirm: onReactivate,
      actions: {
        confirm: "Sí, reactivar período",
        cancel: "Cancelar",
      },
      title: "¿Reactivar período mensual?",
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
          result.errors[0] || "Error al desactivar el período mensual"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Período mensual desactivado", {
        description: (
          <>
            El período mensual{" "}
            <span className="text-foreground font-medium">
  {humanizeMonth(monthlyPeriod.month)}
            </span>{" "}
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
      const result = await reactivateMonthlyPeriod(monthlyPeriod.id)

      if (result.status === "error") {
        const isAuthError = handleAuthError(result.errors[0], router)
        if (isAuthError) {
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al reactivar el período mensual"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Período mensual reactivado", {
        description: (
          <>
            El período mensual{" "}
            <span className="text-foreground font-medium">
  {humanizeMonth(monthlyPeriod.month)}
            </span>{" "}
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
      <DataTableRowActions.Item href={`/dashboard/monthly-periods/${monthlyPeriod.id}`} type="link">
        Ver período
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {monthlyPeriod.isActive ? (
        <DataTableRowActions.Item type="button" variant="destructive" onClick={handleRemove}>
          Desactivar período
        </DataTableRowActions.Item>
      ) : (
        <DataTableRowActions.Item type="button" onClick={handleReactivate}>
          Reactivar período
        </DataTableRowActions.Item>
      )}
    </DataTableRowActions>
  )
}

