"use client"

import type { PropsWithChildren, ComponentProps, HTMLAttributeAnchorTarget } from "react"
import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ButtonAction = {
  type: "button"
  onClick?: () => Promise<void> | void
}

type LinkAction = {
  href: string
  target?: HTMLAttributeAnchorTarget
  type: "link"
}

type ItemProps = {
  disabled?: boolean
  isLoading?: boolean
  variant?: "default" | "destructive"
} & (ButtonAction | LinkAction)

function Item({
  children,
  disabled,
  isLoading,
  variant,
  ...props
}: PropsWithChildren<ItemProps>) {
  if (props.type === "link") {
    const { href, target } = props

    return (
      <DropdownMenuItem asChild disabled={disabled || isLoading} variant={variant}>
        <Link href={href} target={target}>
          {children}
        </Link>
      </DropdownMenuItem>
    )
  }

  const { onClick } = props

  return (
    <DropdownMenuItem
      disabled={disabled || isLoading}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </DropdownMenuItem>
  )
}

export function DataTableRowActions({ children }: PropsWithChildren) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          id="row-actions"
        >
          <span className="sr-only">Abrir menú</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

DataTableRowActions.Separator = DropdownMenuSeparator
DataTableRowActions.Item = Item

