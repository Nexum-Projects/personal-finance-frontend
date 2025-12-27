"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Edit, Trash2 } from "lucide-react"
import { removeCategory } from "@/app/actions/categories"
import { PageHeaderActions } from "@/components/display/page-header-actions"
import { useConfirmationDialogStore } from "@/stores/confirmation-dialog-store"
import type { Category } from "@/app/actions/categories/types"
import { parseApiError } from "@/utils/helpers/parse-api-error"
import { handleAuthError } from "@/utils/helpers/handle-auth-error"

type Props = {
  category: Category
}

export function DetailCategoryActions({ category }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { confirmationDialog } = useConfirmationDialogStore()
  const router = useRouter()

  const handleDeactivate = () => {
    confirmationDialog({
      description: (
        <>
          ¿Estás seguro que deseas desactivar la categoría{" "}
          <span className="text-foreground font-medium">
            {category.name}
          </span>
          ? Esta acción no se puede deshacer.
        </>
      ),
      onConfirm: onDeactivate,
      actions: {
        confirm: "Sí, desactivar categoría",
        cancel: "Cancelar",
      },
      title: "¿Desactivar categoría?",
    })
  }

  const onDeactivate = async () => {
    setLoading(true)

    try {
      const result = await removeCategory(category.id)

      if (result.status === "error") {
        // Verificar si es un error de autenticación
        const isAuthError = handleAuthError(result.errors[0], router)
        
        // Si es error de autenticación, ya se manejó el logout y redirección
        if (isAuthError) {
          setLoading(false)
          return
        }

        const humanizedError = parseApiError(
          result.errors[0] || "Error al desactivar la categoría"
        )
        toast.error(humanizedError.title, {
          description: humanizedError.description,
        })
        setLoading(false)
        return
      }

      toast.success("Categoría desactivada", {
        description: (
          <>
            La categoría{" "}
            <span className="text-foreground font-medium">
              {category.name}
            </span>{" "}
            ha sido desactivada exitosamente.
          </>
        ),
      })

      router.push("/dashboard/categories")
      router.refresh()
    } catch (error) {
      // Manejar errores de autenticación
      handleAuthError(error, router)

      const humanizedError = parseApiError(error)
      toast.error(humanizedError.title, {
        description: humanizedError.description,
      })
      setLoading(false)
    }
  }

  return (
    <PageHeaderActions
      actions={{
        edit: {
          icon: Edit,
          isLoading: loading,
          label: "Editar categoría",
          type: "link",
          href: `/dashboard/categories/${category.id}/edit`,
        },
        deactivate: {
          icon: Trash2,
          isLoading: loading,
          label: "Desactivar categoría",
          type: "button",
          variant: "destructive",
          onClick: handleDeactivate,
        },
      }}
    />
  )
}

