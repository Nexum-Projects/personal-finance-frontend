import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { createElement, type JSX, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const typographyVariants = cva("block text-base font-normal", {
  variants: {
    align: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
      justify: "text-justify",
    },
    variant: {
      h1: "text-4xl font-semibold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      large: "text-lg font-semibold",
      p: "text-base leading-7",
      small: "text-sm leading-none font-medium",
      "x-small": "text-xs leading-none font-medium",
      lead: "text-muted-foreground text-xl",
      muted: "text-muted-foreground text-sm",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    align: "left",
    variant: "p",
  },
})

type Variant = Exclude<
  VariantProps<typeof typographyVariants>["variant"],
  null | undefined
>

const VARIANT_MAP: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  large: "p",
  p: "p",
  small: "small",
  "x-small": "small",
  lead: "p",
  muted: "small",
}

type Props = VariantProps<typeof typographyVariants> & {
  children: ReactNode
  className?: string
}

export function Typography({
  align,
  children,
  className = "",
  variant,
  weight,
}: Props) {
  const component = VARIANT_MAP[variant ?? "p"]

  return createElement(
    component,
    {
      className: cn(typographyVariants({ align, variant, weight, className })),
    },
    children
  )
}

export { typographyVariants }

