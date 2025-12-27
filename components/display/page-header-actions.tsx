"use client"

import type { VariantProps } from "class-variance-authority"
import type { HTMLAttributeAnchorTarget } from "react"
import type { LucideIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  disabled?: boolean
  icon?: LucideIcon
  isLoading?: boolean
  label: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
} & (ButtonAction | LinkAction)

type Props = {
  actions: Record<string, Action>
}

export function PageHeaderActions({ actions }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3 *:shrink-0">
      {Object.entries(actions).map(
        ([key, { disabled, isLoading, variant, label, ...action }]) => {
          if (action.type === "link") {
            const { href, target } = action

            return (
              <Button
                key={key}
                asChild
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
  )
}

