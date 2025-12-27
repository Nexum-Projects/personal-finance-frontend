import { ReactNode } from "react"
import { create } from "zustand"

type ConfirmationDialogParams = {
  description?: ReactNode | string
  title: string
  onCancel?: () => void
  onConfirm: () => Promise<void> | void
  actions?: {
    cancel?: string
    confirm?: string
  }
}

type ConfirmationDialogState = {
  dialog: ConfirmationDialogParams | null
  open: boolean
}

type ConfirmationDialogActions = {
  confirmationDialog: (params: ConfirmationDialogParams) => void
  toggle: () => void
}

export const useConfirmationDialogStore = create<
  ConfirmationDialogState & ConfirmationDialogActions
>((set) => ({
  dialog: null,
  open: false,
  confirmationDialog: (params) =>
    set({
      dialog: params,
      open: true,
    }),
  toggle: () => set((state) => ({ open: !state.open })),
}))

