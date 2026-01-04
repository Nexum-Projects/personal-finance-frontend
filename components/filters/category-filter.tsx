"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/app/actions/transactions/types"

type Props = {
  categories: Category[]
  searchParamName?: string
  label?: string
}

export function CategoryFilter({
  categories,
  searchParamName = "categoryId",
  label = "Categoría",
}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const value = searchParams.get(searchParamName) || undefined

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      params.set(searchParamName, value)
      params.set("page", "1")
    } else {
      params.delete(searchParamName)
      params.set("page", "1")
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={searchParamName}>{label}</Label>
      <Select value={value || "all"} onValueChange={handleChange}>
        <SelectTrigger id={searchParamName}>
          <SelectValue placeholder="Selecciona una categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

