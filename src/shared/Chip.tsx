import { cva, type VariantProps } from 'class-variance-authority'
import { Text, type TouchableOpacityProps } from 'react-native'

import { cn } from '@/utils/cn'

import { Button } from './Button'

const chipVariants = cva(
  'mx-1 flex min-w-[60px] items-center justify-center rounded-full border px-4 py-2.5 shadow',
  {
    variants: {
      isSelected: {
        true: 'bg-BUSIM-blue border-BUSIM-blue',
        false: 'bg-white border-BUSIM-blue',
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

export function Chip({ title, isSelected, onPress, className, ...props }: ChipProps) {
  return (
    <Button
      type="button"
      animationConfig={{ toValue: 0.97 }}
      buttonStyle={cn(chipVariants({ isSelected }), className)}
      pressedColor={cn(isSelected ? 'bg-BUSIM-blue' : 'bg-white')}
      onPress={onPress}
      {...props}
    >
      <Text className={cn(textVariants({ isSelected }), 'leading-normal')} numberOfLines={1}>
        {title}
      </Text>
    </Button>
  )
}
