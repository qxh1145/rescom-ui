import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  decoration?: 'tape' | 'tack' | 'none'
  variant?: 'default' | 'post-it' | 'speech'
  interactive?: boolean
}

export function HandCard({
  className,
  decoration = 'none',
  variant = 'default',
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative p-6 md:p-8 border-2 border-landing-border radius-wobbly-md",
        "transition-transform duration-100",
        {
          "bg-white shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]": variant === 'default',
          "bg-landing-yellow shadow-hard": variant === 'post-it',
          "bg-white shadow-hard relative before:content-[''] before:absolute before:w-0 before:h-0 before:border-t-[15px] before:border-t-landing-border before:border-l-[15px] before:border-l-transparent before:border-r-[15px] before:border-r-transparent before:border-solid before:-bottom-[15px] before:left-8": variant === 'speech',
          "hover:rotate-1 hover:shadow-hard-lg hover:-translate-y-1": interactive,
        },
        className
      )}
      {...props}
    >
      {/* Tape Decoration */}
      {decoration === 'tape' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/10 -rotate-2 z-10" />
      )}
      
      {/* Thumbtack Decoration */}
      {decoration === 'tack' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-landing-accent rounded-full border border-landing-border shadow-sm z-10">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full" />
        </div>
      )}

      {children}
    </div>
  )
}
