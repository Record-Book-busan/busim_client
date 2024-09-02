import { cva, type VariantProps } from 'class-variance-authority'
import React, { useEffect, useRef } from 'react'
import { Animated, View, Text } from 'react-native'

import { cn } from '@/utils/cn'

import { Button, type ButtonProps } from './Button'

const fabVariants = cva('absolute shadow z-50', {
  variants: {
    size: {
      small: 'h-10',
      default: 'h-14',
      large: 'h-16',
    },
    position: {
      bottomRight: 'bottom-4 right-4',
      bottomLeft: 'bottom-4 left-4',
      topRight: 'top-4 right-4',
      topLeft: 'top-4 left-4',
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
    position: 'bottomRight',
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
  visible = true,
  disabled = false,
  size = 'default',
  position = 'bottomRight',
  textStyle,
  buttonStyle,
}) => {
  const animatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current
  const hasText = typeof children === 'string'

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start()
  }, [visible, animatedValue])

  const containerStyle = {
    transform: [{ scale: animatedValue }],
    opacity: animatedValue,
  }

  return (
    <Animated.View style={containerStyle} className={fabVariants({ size, position, hasText })}>
      <Button
        type="container"
        size="sm"
        onPress={onPress}
        disabled={disabled}
        buttonStyle={cn(
          'items-center justify-center',
          fabVariants({ size, hasText }),
          hasText ? 'rounded-full' : '',
          buttonStyle,
        )}
        textStyle={textStyle}
      >
        <View className="flex-row items-center justify-center">
          {leftAddon && <View className="mr-2">{leftAddon}</View>}
          {hasText ? (
            <Text className={cn('font-medium text-gray-800', textStyle)}>{children}</Text>
          ) : (
            children
          )}
          {rightAddon && <View className="ml-2">{rightAddon}</View>}
        </View>
      </Button>
    </Animated.View>
  )
}
