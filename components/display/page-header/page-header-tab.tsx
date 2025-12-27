"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  href: string
  label: string
}

export function PageHeaderTab({ href, label }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Button
      asChild
      className={cn(
        "transition-colors duration-300",
        "z-[1] w-fit rounded-b-none border-b-1",
        {
          "border-b-2": isActive,
        },
        "text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground hover:bg-transparent dark:border-b-zinc-800 dark:hover:bg-transparent",
        {
          "border-b-foreground/15 text-foreground dark:border-b-foreground/15 dark:text-foreground bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800/80 hover:dark:bg-zinc-900":
            isActive,
        }
      )}
      variant="ghost"
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}

