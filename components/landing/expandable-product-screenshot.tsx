"use client"

import Image, { type StaticImageData } from "next/image"
import { ZoomIn } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ExpandableProductScreenshotProps = {
  title: string
  image: StaticImageData
  alt: string
  priority?: boolean
  sizes?: string
  unoptimized?: boolean
  expandLabel?: string
  description?: string
}

export function ExpandableProductScreenshot({
  title,
  image,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 54vw, (min-width: 640px) 92vw, 100vw",
  unoptimized = false,
  expandLabel = "Ver captura",
  description = "Captura ampliada del producto Personal Finance.",
}: ExpandableProductScreenshotProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full overflow-hidden rounded-xl border border-border/80 bg-background text-left outline-none transition duration-300 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Ampliar captura: ${title}`}
        >
          <Image
            src={image}
            alt={alt}
            priority={priority}
            unoptimized={unoptimized}
            sizes={sizes}
            className="h-auto w-full object-cover object-top transition duration-500 group-hover:scale-[1.015]"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition duration-300 group-hover:bg-background/25 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/30 backdrop-blur">
              <ZoomIn className="h-4 w-4 text-primary" />
              {expandLabel}
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[94vh] max-w-[96vw] overflow-hidden border-border bg-background/95 p-3 shadow-2xl shadow-primary/10 backdrop-blur sm:rounded-2xl">
        <DialogTitle className="pr-8 text-base">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <div className="mt-2 overflow-auto rounded-xl border border-border bg-card">
          <div className="flex min-w-full justify-center">
            <Image
              src={image}
              alt={alt}
              unoptimized={unoptimized}
              sizes="96vw"
              className="block h-auto max-h-[78vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
