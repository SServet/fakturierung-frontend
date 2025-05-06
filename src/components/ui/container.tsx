// src/components/ui/container.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full max-w-[78rem] px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    />
  )
)

Container.displayName = 'Container'
