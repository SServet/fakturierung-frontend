// src/components/ui/input.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={cn('input input-bordered w-full', className)}
    />
  )
)
Input.displayName = 'Input'
