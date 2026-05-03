"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserCheck, UserX } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { activateUser, deactivateUser } from "@/app/actions/users"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/i18n/i18n-provider"

type Layout = "table" | "detail"

interface AdminUserStatusButtonsProps {
  userId: string
  isActive: boolean
  layout?: Layout
  className?: string
}

export function AdminUserStatusButtons({
  userId,
  isActive,
  layout = "table",
  className,
}: AdminUserStatusButtonsProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const size = layout === "table" ? "sm" : "default"

  const run = async (action: "activate" | "deactivate") => {
    setPending(true)
    try {
      const result =
        action === "activate" ? await activateUser(userId) : await deactivateUser(userId)

      if (result.status === "success") {
        toast.success(
          action === "activate"
            ? t("admin.users.actions.successActivated")
            : t("admin.users.actions.successDeactivated"),
        )
        router.refresh()
      } else {
        toast.error(result.errors[0]?.message ?? t("admin.users.actions.error"))
      }
    } catch {
      toast.error(t("admin.users.actions.error"))
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        layout === "table" && "justify-end",
        className,
      )}
    >
      {!isActive ? (
        <Button
          type="button"
          size={size}
          variant={layout === "detail" ? "default" : "secondary"}
          disabled={pending}
          onClick={() => void run("activate")}
          className="gap-1.5"
        >
          <UserCheck className="h-4 w-4" />
          {t("admin.users.actions.activate")}
        </Button>
      ) : (
        <Button
          type="button"
          size={size}
          variant="outline"
          disabled={pending}
          onClick={() => void run("deactivate")}
          className="gap-1.5"
        >
          <UserX className="h-4 w-4" />
          {t("admin.users.actions.deactivate")}
        </Button>
      )}
    </div>
  )
}
