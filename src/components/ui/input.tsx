import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow,border-color] duration-200",
        "placeholder:text-muted-foreground",
        "hover:border-[#608E7E]/60",
        "focus:!border-[#608E7E] focus:!ring-1 focus:!ring-[#608E7E]/30",
        "focus-visible:!border-[#608E7E] focus-visible:!ring-1 focus-visible:!ring-[#608E7E]/30",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        "selection:bg-primary selection:text-primary-foreground",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
