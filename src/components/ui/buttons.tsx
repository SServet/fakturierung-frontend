// src/components/ui/button.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'btn'
  const v = `btn-${variant}`         // e.g. btn-primary, btn-ghost
  const s =
    size === 'sm' ? 'btn-sm' :
    size === 'lg' ? 'btn-lg' :
    'btn-md'

  return (
    <button
      {...props}
      className={cn(base, v, s, className)}
    />
  )
}
Button.displayName = 'Button'
