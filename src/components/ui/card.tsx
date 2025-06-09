// src/components/ui/card.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div {...props} className={cn('card bg-base-100 shadow-lg', className)}>
      {children}
    </div>
  )
}
Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div {...props} className={cn('card-header', className)}>
      {children}
    </div>
  )
}
CardHeader.displayName = 'CardHeader'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div {...props} className={cn('card-body', className)}>
      {children}
    </div>
  )
}
CardContent.displayName = 'CardContent'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}
export function CardTitle({ className = '', children, ...props }: CardTitleProps) {
  return (
    <h2 {...props} className={cn('card-title', className)}>
      {children}
    </h2>
  )
}
CardTitle.displayName = 'CardTitle'
