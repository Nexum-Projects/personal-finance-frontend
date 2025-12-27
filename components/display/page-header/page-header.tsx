import type { VariantProps } from "class-variance-authority"
import { ArrowLeft, Loader2, type LucideIcon } from "lucide-react"
import Link from "next/link"
import {
  isValidElement,
  type ComponentProps,
  type HTMLAttributeAnchorTarget,
  type ReactNode,
} from "react"
import { Button, type buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Typography } from "../typography"
import { PageHeaderTab } from "./page-header-tab"

type ButtonAction = {
  type: "button"
  onClick: () => Promise<void> | void
}

type LinkAction = {
  href: string
  target?: HTMLAttributeAnchorTarget
  type: "link"
}

type Action = {
  className?: string
  disabled?: boolean
  icon?: LucideIcon
  isLoading?: boolean
  label: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
} & (ButtonAction | LinkAction)

type Props = {
  hideSeparator?: boolean
  actions?: ReactNode | Record<string, Action>
  className?: string
  description?: string
  tabs?: Record<string, ComponentProps<typeof PageHeaderTab>>
  title: ReactNode
  backTo?: {
    href: string
    label: string
  }
}

export function PageHeader({
  actions,
  backTo,
  className = "",
  description,
  hideSeparator = false,
  tabs,
  title,
}: Props) {
  return (
    <header className={cn("grid gap-4", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        <div className="grid min-w-fit flex-1 gap-2">
          {backTo && (
            <Button
              asChild
              className="hover:bg-primary/10 text-primary hover:text-primary dark:hover:bg-primary/20 w-fit"
              size="sm"
              variant="ghost"
            >
              <Link href={backTo.href}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backTo.label}
              </Link>
            </Button>
          )}
          <Typography className="leading-10 font-medium" variant="h1">
            {title}
          </Typography>
          {description && (
            <Typography
              className="text-muted-foreground leading-tight"
              variant="p"
            >
              {description}
            </Typography>
          )}
        </div>
        {actions && typeof actions === "object" && !isValidElement(actions) ? (
          <div className="flex max-w-[calc(100vw-2rem)] min-w-0 items-end gap-3 overflow-x-auto *:shrink-0 lg:flex-row-reverse xl:max-w-[calc(100vw-var(--sidebar-width,256px)-2rem)]">
            {Object.entries(actions).map(
              ([
                key,
                { disabled, isLoading, variant, label, className: actionClassName, ...action },
              ]) => {
                if (action.type === "link") {
                  const { href, target } = action

                  return (
                    <Button
                      key={key}
                      asChild
                      className={actionClassName}
                      disabled={disabled || isLoading}
                      variant={variant}
                    >
                      <Link href={href} target={target}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {action.icon && (
                          <action.icon
                            className={cn("mr-2 h-4 w-4", {
                              hidden: isLoading,
                            })}
                          />
                        )}
                        {label}
                      </Link>
                    </Button>
                  )
                }

                return (
                  <Button
                    key={key}
                    disabled={disabled || isLoading}
                    variant={variant}
                    onClick={action.onClick}
                    className={actionClassName}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {action.icon && (
                      <action.icon
                        className={cn("mr-2 h-4 w-4", {
                          hidden: isLoading,
                        })}
                      />
                    )}
                    {label}
                  </Button>
                )
              }
            )}
          </div>
        ) : (
          actions
        )}
      </div>
      <div
        className={cn(
          "max-w-[calc(100vw-2rem)] xl:max-w-[calc(100vw-var(--sidebar-width,256px)-2rem)]",
          {
            hidden: !tabs && hideSeparator,
          }
        )}
      >
        {tabs && (
          <div className="flex h-fit w-full max-w-[calc(100vw-2rem)] min-w-0 gap-0 overflow-x-auto xl:max-w-[calc(100vw-var(--sidebar-width,256px)-2rem)]">
            {Object.entries(tabs).map(([key, tab]) => (
              <PageHeaderTab key={key} {...tab} />
            ))}
          </div>
        )}
        {!hideSeparator && (
          <Separator
            className={cn("dark:bg-zinc-800", {
              "-mt-px": !!tabs,
            })}
          />
        )}
      </div>
    </header>
  )
}

