"use client"

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form"

import { type ComponentProps, type MouseEvent } from "react"
import { NumericFormat, type OnValueChange } from "react-number-format"

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
  Pick<
    ComponentProps<"input">,
    "autoComplete" | "className" | "disabled" | "placeholder"
  > &
  Pick<
    ComponentProps<typeof NumericFormat>,
    "decimalScale" | "prefix" | "suffix"
  > & {
    description?: string
    label?: string
    onChange?: (value: number | undefined) => void
  }

export function NumericField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  autoComplete = "off",
  className = "",
  control,
  decimalScale = 0,
  description,
  disabled = false,
  label,
  name,
  placeholder,
  prefix,
  suffix,
  onChange: onChangeAction,
}: Props<TFieldValues, TName>) {
  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select()
  }


  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => {
        const handleChange: OnValueChange = ({ floatValue }) => {
          onChange(floatValue)
          onChangeAction?.(floatValue)
        }

        return (
          <FormItem className={className} disabled={disabled}>
            <FormLabel
              className={cn("after:absolute after:-inset-0", {
                "sr-only": !label,
              })}
            >
              {label ?? name}
            </FormLabel>
            <FormControl>
              <NumericFormat
                {...field}
                valueIsNumericString
                autoComplete={autoComplete}
                className="relative [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                customInput={Input}
                decimalScale={decimalScale}
                disabled={disabled}
                placeholder={placeholder}
                prefix={prefix}
                suffix={suffix}
                thousandSeparator=","
                type="text"
                value={value === 0 || value === undefined ? "" : value}
                onClick={handleClick}
                onValueChange={handleChange}
                allowNegative={false}
                isAllowed={(values) => {
                  const { floatValue } = values
                  return floatValue === undefined || floatValue >= 0
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

