"use client"

import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form"
import type { ComponentProps } from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

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
  }

export function PasswordField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  autoComplete = "new-password",
  placeholder,
  className = "",
  control,
  description,
  disabled = false,
  label,
  name,
}: Props<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false)

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
            <div className="relative">
              <Input
                {...field}
                autoComplete={autoComplete}
                disabled={disabled}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none disabled:opacity-50"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

