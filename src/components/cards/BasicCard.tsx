import React from 'react'

import { cn } from '@/lib/utils';


type CardProps = {
  classNames?: string;
  width?: number | string;
  children: React.ReactNode;
}

const BasicCard = ({ width = 450, children, classNames }: CardProps) => {
  return (
    <div
      style={{ width: "auto", maxWidth: width }}
      className={cn(
        "rounded-xl border border-gray-100 bg-white px-8 py-8 shadow-md overflow-hidden",
        classNames
      )}>
      {children}
    </div>
  )
}

export default BasicCard