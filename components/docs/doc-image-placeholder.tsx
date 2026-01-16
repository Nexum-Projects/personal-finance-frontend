import { cn } from "@/lib/utils"

type Props = {
  title: string
  description?: string
  className?: string
}

/**
 * PLACEHOLDER DE DOCUMENTACIÓN (IMÁGENES / GIFs)
 *
 * - En las páginas de documentación colocamos este componente para marcar el lugar exacto
 *   donde irá una imagen o GIF de referencia.
 * - Para publicar la documentación "sin imágenes" (más limpia), este componente NO se renderiza
 *   por defecto.
 * - Para mostrar los placeholders temporalmente:
 *   - Define `NEXT_PUBLIC_SHOW_DOC_MEDIA_PLACEHOLDERS=true`
 *   - y vuelve a construir el proyecto.
 * - Para encontrar rápidamente todos los puntos donde van imágenes, busca en el repo:
 *   - el texto: `[IMAGEN / GIF]`
 */
const SHOW_DOC_MEDIA_PLACEHOLDERS =
  process.env.NEXT_PUBLIC_SHOW_DOC_MEDIA_PLACEHOLDERS === "true"

export function DocImagePlaceholder({ title, description, className = "" }: Props) {
  if (!SHOW_DOC_MEDIA_PLACEHOLDERS) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground",
        className
      )}
    >
      <div className="font-medium text-foreground">{title}</div>
      <div className="mt-1">
        {description ??
          "Espacio reservado para agregar una imagen o GIF de referencia en la documentación."}
      </div>
    </div>
  )
}

