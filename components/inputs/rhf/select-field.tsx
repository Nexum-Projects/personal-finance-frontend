"use client"

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form"

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
  transformValue?: (value: string) => unknown
}

export function SelectField<
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
  transformValue,
}: Props<TFieldValues, TName>) {
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
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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

