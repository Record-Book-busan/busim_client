import { cva, type VariantProps } from 'class-variance-authority'
import { Text, View, type TouchableOpacityProps } from 'react-native'

import { cn } from '@/utils/cn'

import { Button } from './Button'

const chipVariants = cva(
  'mx-1 min-w-[60px] items-center justify-center rounded-full border px-4 h-9 shadow',
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

const textVariants = cva('text-center text-sm', {
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
      <View className="items-center justify-center">
        <Text className={cn(textVariants({ isSelected }))} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Button>
  )
}
