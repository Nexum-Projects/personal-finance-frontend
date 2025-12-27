import type { ReactNode } from "react"
import { Typography } from "@/components/display/typography"
import { cn } from "@/lib/utils"

type Props = {
  label?: string
  value: ReactNode | string
  classNames?: {
    container?: string
    label?: string
    value?: string
  }
}

export function SectionField({ classNames, label, value }: Props) {
  const {
    container: containerClassName = "",
    label: labelClassName = "",
    value: valueClassName = "",
  } = classNames ?? {}

  return (
    <div
      className={cn(
        "grid w-full gap-1 pb-3 last:pb-0",
        {
          "gap-2 pb-4": typeof value !== "string",
        },
        containerClassName
      )}
    >
      {label && (
        <Typography
          className={cn("text-muted-foreground leading-4", labelClassName)}
          variant="small"
        >
          {label}
        </Typography>
      )}
      {typeof value === "string" ? (
        <Typography
          className={cn(
            "text-foreground leading-6 text-pretty break-all",
            valueClassName
          )}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </div>
  )
}

