// src/components/ui/container.tsx
import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
export function Container({ className = '', children, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}
    >
      {children}
    </div>
  )
}
Container.displayName = 'Container'
