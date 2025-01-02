import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl',
      className
    )}>
      {children}
    </div>
  )
}

export default Card