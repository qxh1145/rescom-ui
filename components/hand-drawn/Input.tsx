import { cn } from "@/lib/utils"
import React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export const HandInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", wrapperClassName)}>
        <input
          className={cn(
            "flex h-12 w-full bg-white px-4 py-2 font-patrick text-lg",
            "border-2 border-landing-border radius-wobbly",
            "placeholder:text-landing-border/40",
            "focus:outline-none focus:border-landing-secondary focus:ring-2 focus:ring-landing-secondary/20",
            "transition-colors duration-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
HandInput.displayName = "HandInput"
