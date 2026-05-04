// components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:     "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline:     "border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-300 text-gray-700",
        secondary:   "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost:       "hover:bg-gray-100 text-gray-700",
        link:        "text-indigo-600 underline-offset-4 hover:underline",
        gradient:    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm:      "h-9 px-4 text-xs",
        lg:      "h-12 px-8 text-base",
        xl:      "h-14 px-10 text-lg",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
export { Button, buttonVariants }