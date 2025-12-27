import type { ComponentProps } from "react"
import { Typography } from "@/components/display/typography"
import { cn } from "@/lib/utils"
import { SectionField } from "./section-field"

type Props = {
  description?: string
  fields: Record<string, ComponentProps<typeof SectionField>>
  orientation?: "horizontal" | "vertical"
  title: string
  classNames?: {
    container?: string
    fieldsContainer?: string
    header?: string
  }
}

export function PageSection({
  description,
  fields,
  orientation,
  title,
  classNames = {},
}: Props) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,_320px)_minmax(0,_1fr)] lg:gap-8",
        {
          "grid-cols-[minmax(0,_320px)_minmax(0,_1fr)]":
            orientation === "horizontal",
          "lg:grid-cols-none lg:gap-4": orientation === "vertical",
        },
        classNames.container
      )}
    >
      <div className={cn("space-y-1", classNames.header)}>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography
            className="text-muted-foreground leading-5 text-pretty"
            variant="p"
          >
            {description}
          </Typography>
        )}
      </div>
      <div className={cn("grid min-w-0 gap-3", classNames.fieldsContainer)}>
        {Object.entries(fields).map(([key, field]) => (
          <SectionField key={key} {...field} />
        ))}
      </div>
    </div>
  )
}

