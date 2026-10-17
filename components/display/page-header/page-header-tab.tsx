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
        "border-b-1 z-[1] w-fit rounded-b-none",
        {
          "border-b-2": isActive,
        },
        "text-foreground/60 hover:bg-transparent dark:border-b-zinc-800 dark:text-foreground/70 dark:hover:bg-transparent dark:hover:text-foreground",
        {
          "border-b-foreground/15 bg-zinc-100 text-foreground hover:bg-zinc-100 dark:border-b-foreground/15 dark:bg-zinc-800/80 dark:text-foreground hover:dark:bg-zinc-900":
            isActive,
        }
      )}
      variant="ghost"
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}
