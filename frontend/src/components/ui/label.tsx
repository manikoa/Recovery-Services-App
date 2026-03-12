/**
 * Label Component
 * 
 * A styled label component for form inputs.
 * Based on shadcn/ui label component.
 * 
 * Features:
 * 1. Accessible label for form controls
 * 2. Consistent styling with the design system
 * 3. Support for disabled states
 * 
 * Usage:
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * ```
 * 
 * Implementation notes:
 * - Uses Radix UI's Label primitive for accessibility
 * - Uses class-variance-authority for styling
 * - Uses React.forwardRef for ref forwarding
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define label variants using cva
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Implement your Label component here
// This is a placeholder - you can use the shadcn/ui Label implementation
// or create your own custom implementation

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }