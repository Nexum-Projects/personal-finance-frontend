"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/components/i18n/i18n-provider"

type Props = {
  startDateParamName?: string
  endDateParamName?: string
}

export function DateRangeFilter({
  startDateParamName = "startDate",
  endDateParamName = "endDate",
}: Props) {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const startDate = searchParams.get(startDateParamName) || ""
  const endDate = searchParams.get(endDateParamName) || ""

  const handleStartDateChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(startDateParamName, value)
      params.set("page", "1")
    } else {
      params.delete(startDateParamName)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleEndDateChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(endDateParamName, value)
      params.set("page", "1")
    } else {
      params.delete(endDateParamName)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="start-date">{t("dateRange.start")}</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="end-date">{t("dateRange.end")}</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  )
}

