import { Text, type TextProps } from 'react-native'

import { cn } from '@/utils/cn'

import type { ReactNode } from 'react'

interface TypoProps extends TextProps {
  className: string
  children: ReactNode
}

export function Typo({ className, children, ...props }: TypoProps) {
  return (
    <Text
      className={cn('font-Regular tracking-tight', className)}
      style={{ includeFontPadding: false }}
      {...props}
    >
      {children}
    </Text>
  )
}
