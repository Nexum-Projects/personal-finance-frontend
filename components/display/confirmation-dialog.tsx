"use client"

import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ConfirmationDialog() {
  const { dialog, open, toggle } = useConfirmationDialogStore()

  return (
    <AlertDialog open={open} onOpenChange={toggle}>
      {dialog && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
            {dialog.description && (
              <AlertDialogDescription>
                {dialog.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={dialog?.onCancel}>
              {dialog.actions?.cancel ? dialog.actions.cancel : "Cancelar"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={dialog?.onConfirm}>
              {dialog.actions?.confirm ? dialog.actions.confirm : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}

