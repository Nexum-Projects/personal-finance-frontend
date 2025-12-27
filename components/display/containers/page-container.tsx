import type { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export function PageContainer({
  className = "",
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        "space-y-8 p-[var(--page-padding)] pb-8 md:p-[var(--page-padding)]",
        className
      )}
      {...props}
    />
  )
}

