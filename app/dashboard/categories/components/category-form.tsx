"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormSection } from "@/components/display/form/form-section"
import { TextField } from "@/components/inputs/rhf/text-field"
import { SelectField } from "@/components/inputs/rhf/select-field"
import { categorySchema, type CategoryFormValues } from "@/app/actions/categories/schema"

type Props = {
  defaultValues?: CategoryFormValues
  onSubmit: SubmitHandler<CategoryFormValues>
  isSubmitting?: boolean
  backToHref: string
  isOnEdit?: boolean
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  backToHref,
  isOnEdit = false,
}: Props) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      name: "",
      categoryType: undefined,
    },
  })

  return (
    <Form {...form}>
      <form className="grid space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection
          description={`Ingresa los datos generales de la ${
            !isOnEdit ? "nueva" : ""
          } categoría`}
          title="Datos generales"
        >
          <TextField
            control={form.control}
            description="El nombre debe tener entre 1 y 255 caracteres"
            label="Nombre"
            name="name"
            placeholder="Ingresa el nombre de la categoría"
          />

          <SelectField
            control={form.control}
            description="Selecciona si esta categoría es para ingresos o gastos"
            label="Tipo de categoría"
            name="categoryType"
            options={[
              { label: "Ingreso", value: "INCOME" },
              { label: "Gasto", value: "EXPENSE" },
            ]}
            placeholder="Selecciona el tipo de categoría"
          />
        </FormSection>

        <div className="flex flex-row-reverse items-center justify-start gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar
          </Button>
          <Button asChild variant="outline" disabled={isSubmitting}>
            <Link href={backToHref}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

