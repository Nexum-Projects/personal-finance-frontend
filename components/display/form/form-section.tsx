import type { PropsWithChildren } from "react"

import { Typography } from "@/components/display/typography"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  description?: string
  orientation?: "horizontal" | "vertical"
  title: string
}

export function FormSection({
  title,
  className = "",
  description = "",
  orientation,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,_320px)_minmax(0,_1fr)] lg:gap-8",
        {
          "grid-cols-[minmax(0,_320px)_minmax(0,_1fr)]":
            orientation === "horizontal",
          "lg:grid-cols-none lg:gap-4": orientation === "vertical",
        },
        className
      )}
    >
      <div className="space-y-1">
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography className="leading-5 text-pretty" variant="muted">
            {description}
          </Typography>
        )}
      </div>
      <div className="grid min-w-0 gap-6">{children}</div>
    </div>
  )
}

