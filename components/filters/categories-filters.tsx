"use client"

import { Filter, X, XCircle } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
import { useI18n } from "@/components/i18n/i18n-provider"
import { useUserPreferences } from "@/components/preferences/user-preferences-provider"
import { humanizeCategoryType } from "@/utils/helpers/humanize-category-type"

type Props = {
  startDateParamName?: string
  endDateParamName?: string
  categoryTypeParamName?: string
}

export function CategoriesFilters({
  startDateParamName = "startDate",
  endDateParamName = "endDate",
  categoryTypeParamName = "categoryType",
}: Props) {
  const { t } = useI18n()
  const { preferredLanguage } = useUserPreferences()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startDate = searchParams.get(startDateParamName)
  const endDate = searchParams.get(endDateParamName)
  const categoryType = searchParams.get(categoryTypeParamName)

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(startDateParamName)
    params.delete(endDateParamName)
    params.delete(categoryTypeParamName)
    params.set("page", "1")
    router.replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    let count = 0
    if (startDate) count++
    if (endDate) count++
    if (categoryType) count++
    setActiveFiltersCount(count)
  }, [startDate, endDate, categoryType])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full md:w-fit" variant="outline">
          <Filter className="h-4 w-4" />
          {t("filters.button")}
          {activeFiltersCount > 0 && (
            <>
              <Separator
                className="bg-border rounded-xs data-[orientation=vertical]:h-4/5 data-[orientation=vertical]:w-0.5 mx-2"
                orientation="vertical"
              />
              <div className="bg-primary/10 text-primary grid h-5 w-fit shrink-0 place-items-center rounded-xs px-1.5">
                <span className="text-xs leading-none">
                  {activeFiltersCount === 1
                    ? t("filters.active.singular", { count: activeFiltersCount })
                    : t("filters.active.plural", { count: activeFiltersCount })}
                </span>
              </div>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-none sm:max-w-md flex flex-col">
        <SheetHeader className="relative flex-shrink-0">
          <SheetTitle className="text-xl leading-6">{t("filters.title")}</SheetTitle>
          <SheetDescription className="mr-11">
            {t("filters.description")}
          </SheetDescription>
          <SheetClose asChild>
            <Button
              className="absolute top-4 right-4 size-8"
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("categories.filters.type")}</Label>
            <Select
              value={categoryType ?? "ALL"}
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams.toString())
                if (value === "ALL") {
                  params.delete(categoryTypeParamName)
                } else {
                  params.set(categoryTypeParamName, value)
                }
                params.set("page", "1")
                router.replace(`${pathname}?${params.toString()}`)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("categories.filters.selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("categories.filters.all")}</SelectItem>
                <SelectItem value="EXPENSE">
                  {humanizeCategoryType("EXPENSE", preferredLanguage)}
                </SelectItem>
                <SelectItem value="INCOME">
                  {humanizeCategoryType("INCOME", preferredLanguage)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <SheetFooter className="flex-shrink-0 px-4 pb-4 border-t pt-4 mt-auto">
            <Button
              className="w-full"
              type="button"
              variant="destructive"
              onClick={() => {
                handleClearFilters()
                setOpen(false)
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t("filters.clear")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

