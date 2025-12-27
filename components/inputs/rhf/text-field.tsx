"use client"

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form"

import { ComponentProps } from "react"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Pick<ComponentProps<"input">, "autoComplete" | "inputMode"> & {
    className?: string
    description?: string
    disabled?: boolean
    label?: string
    placeholder?: string
    type?: "email" | "password" | "tel" | "text" | "date"
  }

export function TextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  autoComplete = "off",
  placeholder,
  className = "",
  control,
  description,
  disabled = false,
  label,
  name,
  type = "text",
}: Props<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className} disabled={disabled}>
          <FormLabel
            className={cn({
              "sr-only": !label,
            })}
          >
            {label ?? name}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete={autoComplete}
              disabled={disabled}
              placeholder={placeholder}
              type={type}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

