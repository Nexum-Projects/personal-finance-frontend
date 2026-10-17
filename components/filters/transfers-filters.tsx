"use client"

import { Filter, X, XCircle } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/components/i18n/i18n-provider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DateRangeFilter } from "./date-range-filter"

type Props = {
  startDateParamName?: string
  endDateParamName?: string
}

export function TransfersFilters({
  startDateParamName = "startDate",
  endDateParamName = "endDate",
}: Props) {
  const { t } = useI18n()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startDate = searchParams.get(startDateParamName)
  const endDate = searchParams.get(endDateParamName)

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(startDateParamName)
    params.delete(endDateParamName)
    params.set("page", "1")
    router.replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    let count = 0
    if (startDate) count++
    if (endDate) count++
    setActiveFiltersCount(count)
  }, [startDate, endDate])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full md:w-fit" variant="outline">
          <Filter className="h-4 w-4" />
          {t("filters.button")}
          {activeFiltersCount > 0 && (
            <>
              <Separator
                className="rounded-xs mx-2 bg-border data-[orientation=vertical]:h-4/5 data-[orientation=vertical]:w-0.5"
                orientation="vertical"
              />
              <div className="rounded-xs grid h-5 w-fit shrink-0 place-items-center bg-primary/10 px-1.5 text-primary">
                <span className="text-xs leading-none">
                  {activeFiltersCount === 1
                    ? t("filters.active.singular", {
                        count: activeFiltersCount,
                      })
                    : t("filters.active.plural", { count: activeFiltersCount })}
                </span>
              </div>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-none sm:max-w-md">
        <SheetHeader className="relative flex-shrink-0">
          <SheetTitle className="text-xl leading-6">
            {t("filters.title")}
          </SheetTitle>
          <SheetDescription className="mr-11">
            {t("filters.description")}
          </SheetDescription>
          <SheetClose asChild>
            <Button
              className="absolute right-4 top-4 size-8"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
              <span className="sr-only">{t("filters.close")}</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          <DateRangeFilter
            startDateParamName={startDateParamName}
            endDateParamName={endDateParamName}
          />
        </div>

        {activeFiltersCount > 0 && (
          <SheetFooter className="mt-auto flex-shrink-0 border-t px-4 pb-4 pt-4">
            <Button
              className="w-full"
              type="button"
              variant="destructive"
              onClick={() => {
                handleClearFilters()
                setOpen(false)
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("filters.clear")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
