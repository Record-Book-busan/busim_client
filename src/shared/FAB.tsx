import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { View, Text } from 'react-native'

import { cn } from '@/utils/cn'

import { ButtonPrimitive, type ButtonProps } from './Button'

const fabVariants = cva('absolute shadow z-50', {
  variants: {
    size: {
      small: 'h-10',
      default: 'h-14',
      large: 'h-16',
    },
    position: {
      center: 'w-full top-1/2 justify-center items-center',
      topCenter: 'w-full top-4 justify-center items-center',
      topRight: 'top-4 right-4',
      topLeft: 'top-4 left-4',
      bottomCenter: 'w-full bottom-4 justify-center items-center',
      bottomRight: 'bottom-4 right-4',
      bottomLeft: 'bottom-4 left-4',
    },
    hasText: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      hasText: false,
      size: 'small',
      class: 'w-10 rounded-full',
    },
    {
      hasText: false,
      size: 'default',
      class: 'w-14 rounded-full',
    },
    {
      hasText: false,
      size: 'large',
      class: 'w-16 rounded-full',
    },
  ],
  defaultVariants: {
    size: 'default',
    hasText: false,
  },
})

export interface FABProps extends VariantProps<typeof fabVariants>, ButtonProps {
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
  visible?: boolean
}

export const FAB: React.FC<FABProps> = ({
  children,
  leftAddon,
  rightAddon,
  onPress,
  size = 'default',
  position = 'bottomRight',
  buttonStyle,
  textStyle,
}) => {
  // const animatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current
  const hasText = typeof children === 'string'

  // useEffect(() => {
  //   Animated.spring(animatedValue, {
  //     toValue: visible ? 1 : 0,
  //     useNativeDriver: true,
  //   }).start()
  // }, [visible, animatedValue])

  // const containerStyle = {
  //   transform: [{ scale: animatedValue }],
  //   opacity: animatedValue,
  // }

  return (
    <View className={cn(fabVariants({ size, position, hasText }))}>
      <ButtonPrimitive onPress={onPress}>
        <View className={cn('flex-row items-center justify-center', buttonStyle)}>
          {leftAddon && <View className="mr-2">{leftAddon}</View>}
          {hasText ? (
            <Text className={cn('font-medium text-gray-800', textStyle)}>{children}</Text>
          ) : (
            children
          )}
          {rightAddon && <View className="ml-2">{rightAddon}</View>}
        </View>
      </ButtonPrimitive>
    </View>
  )
}
