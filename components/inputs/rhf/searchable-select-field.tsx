"use client"

import { useMemo, useState } from "react"
import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SelectOption = {
  label: string
  value: string
}

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & {
  className?: string
  description?: string
  disabled?: boolean
  label?: string
  options: SelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  transformValue?: (value: string) => unknown
}

export function SearchableSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className = "",
  control,
  description,
  disabled = false,
  label,
  name,
  options,
  placeholder,
  searchPlaceholder = "Buscar...",
  transformValue,
}: Props<TFieldValues, TName>) {
  const [query, setQuery] = useState("")

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      const labelText = o.label.toLowerCase()
      const valueText = o.value.toLowerCase()
      return labelText.includes(q) || valueText.includes(q)
    })
  }, [options, query])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleValueChange = (value: string) => {
          if (transformValue) {
            field.onChange(transformValue(value))
          } else {
            field.onChange(value)
          }
        }

        const displayValue = field.value?.toString() || ""

        return (
          <FormItem className={className} disabled={disabled}>
            <FormLabel
              className={cn({
                "sr-only": !label,
              })}
            >
              {label ?? name}
            </FormLabel>
            <Select
              onValueChange={handleValueChange}
              defaultValue={displayValue}
              value={displayValue}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <div className="p-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    className="h-9"
                    onKeyDown={(e) => {
                      // Evita que el Select capture teclas y cierre o navegue raro mientras escribes
                      e.stopPropagation()
                    }}
                  />
                </div>
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Sin resultados
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

