import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow,border-color] duration-200",
        "placeholder:text-muted-foreground",
        "hover:border-green/60",
        "focus:!border-[var(--color-green)] focus:!ring-1 focus:!ring-[var(--color-green)]/30",
        "focus-visible:!border-[var(--color-green)] focus-visible:!ring-1 focus-visible:!ring-[var(--color-green)]/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
