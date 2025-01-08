import React from 'react'

import { cn } from '@/lib/utils';

const CustomBorderWrapper = ({ children, isSelected }: {
  isSelected?: boolean;
  children: React.ReactNode
}) => {
  return (
    <div className={cn(
      'relative inline-block p-[2px] rounded-md w-full min-w-[30px] hover:bg-purple-200',
      isSelected ? 'bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500 shadow-md' : 'bg-gray-200'
    )}>
      {children}
    </div>
  )
}

export { CustomBorderWrapper }