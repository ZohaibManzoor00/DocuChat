import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-lg border border-secondary bg-secondary px-4 text-base text-black placeholder-zinc-500 shadow-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
