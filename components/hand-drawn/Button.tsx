import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function HandButton({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-patrick transition-all duration-100",
        "border-[3px] border-landing-border radius-wobbly shadow-hard",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        {
          "bg-white text-landing-fg hover:bg-landing-accent hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm": variant === 'primary',
          "bg-landing-muted text-landing-fg hover:bg-landing-secondary hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm": variant === 'secondary',
          "bg-transparent text-landing-fg hover:bg-white": variant === 'outline',
          "h-10 px-4 text-base": size === 'sm',
          "h-12 px-6 text-lg md:text-xl": size === 'md',
          "h-14 px-8 text-xl md:text-2xl": size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
