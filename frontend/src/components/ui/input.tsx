/**
 * Input Component
 * 
 * A styled input component for collecting user input.
 * Based on shadcn/ui input component.
 * 
 * Features:
 * 1. Standard HTML input attributes
 * 2. Consistent styling with the design system
 * 3. Support for different input types (text, email, password, etc.)
 * 
 * Usage:
 * ```tsx
 * <Input type="email" placeholder="Email" />
 * <Input type="password" placeholder="Password" />
 * ```
 * 
 * Implementation notes:
 * - Uses React.forwardRef for ref forwarding
 * - Uses cn utility for class name merging
 * - Extends standard HTML input attributes
 */

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Implement your Input component here
// This is a placeholder - you can use the shadcn/ui Input implementation
// or create your own custom implementation

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }