import { cva, type VariantProps } from 'class-variance-authority'
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native'

import { cn } from '@/utils/cn'

const chipVariants = cva(
  'mx-1 flex min-w-[60px] items-center justify-center rounded-full border px-4 py-2.5 shadow',
  {
    variants: {
      isSelected: {
        true: 'bg-[#2653B0] border-[#2653B0]',
        false: 'bg-white border-[#2653B0]',
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
)

const textVariants = cva('text-center text-sm leading-[0px]', {
  variants: {
    isSelected: {
      true: 'font-semibold text-white',
      false: 'font-normal text-black',
    },
  },
  defaultVariants: {
    isSelected: false,
  },
})

export interface ChipProps extends TouchableOpacityProps, VariantProps<typeof chipVariants> {
  title: string
}

export function Chip({ title, isSelected, onPress, className, ...rest }: ChipProps) {
  return (
    <TouchableOpacity
      className={cn(chipVariants({ isSelected }), className)}
      onPress={onPress}
      {...rest}
    >
      <Text className={cn(textVariants({ isSelected }))} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
