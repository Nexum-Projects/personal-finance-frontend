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
import type { Account } from "@/app/actions/transactions/types"

type Props = {
  accounts: Account[]
  searchParamName?: string
  label?: string
}

export function AccountFilter({
  accounts,
  searchParamName = "accountId",
  label = "Cuenta",
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
          <SelectValue placeholder="Selecciona una cuenta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las cuentas</SelectItem>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

