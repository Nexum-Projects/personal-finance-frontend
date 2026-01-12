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
          ¿Estás seguro que deseas desactivar el presupuesto mensual{" "}
          <span className="text-foreground font-medium">
{humanizeMonth(monthlyPeriod.month)}
          </span>?
          Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onRemove,
      actions: {
        confirm: "Sí, desactivar presupuesto",
        cancel: "Cancelar",
      },
      title: "¿Desactivar presupuesto mensual?",
    })
  }

  const handleReactivate = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas reactivar el presupuesto mensual{" "}
          <span className="text-foreground font-medium">
{humanizeMonth(monthlyPeriod.month)}
          </span>?
        </>
      ),
      onConfirm: onReactivate,
      actions: {
        confirm: "Sí, reactivar presupuesto",
        cancel: "Cancelar",
      },
      title: "¿Reactivar presupuesto mensual?",
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
          result.errors[0] || "Error al desactivar el presupuesto mensual"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Presupuesto mensual desactivado", {
        description: (
          <>
            El presupuesto mensual{" "}
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
          result.errors[0] || "Error al reactivar el presupuesto mensual"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        return
      }

      toast.success("Presupuesto mensual reactivado", {
        description: (
          <>
            El presupuesto mensual{" "}
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
        Ver presupuesto mensual
      </DataTableRowActions.Item>
      <DataTableRowActions.Separator />
      {monthlyPeriod.isActive ? (
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

