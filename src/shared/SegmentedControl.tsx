import { cva, type VariantProps } from 'class-variance-authority'
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Animated, TouchableOpacity, LayoutChangeEvent } from 'react-native'

import { cn } from '../utils/cn'

const segmentedControlVariants = cva(
  'flex flex-row items-center justify-center rounded-lg bg-BUSIM-slate-light',
  {
    variants: {
      size: {
        sm: 'p-1',
        md: 'px-1 py-1.5',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const tabVariants = cva('flex-1 items-center justify-center', {
  variants: {
    size: {
      sm: 'py-1.5 px-2',
      md: 'py-2 px-1',
      lg: 'py-2 px-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const textVariants = cva('text-md font-semibold leading-[0px]', {
  variants: {
    active: {
      true: 'text-BUSIM-blue',
      false: 'text-BUSIM-slate-dark',
    },
  },
  defaultVariants: {
    active: false,
  },
})

interface SegmentedControlProps extends VariantProps<typeof segmentedControlVariants> {
  tabs: string[]
  initialIndex?: number
  onChange: (index: number) => void
  value?: number
  containerStyle?: string
  textStyle?: string
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  tabs,
  onChange,
  value,
  initialIndex = 0,
  size,
  containerStyle,
  textStyle,
}) => {
  const [slideAnimation] = useState(new Animated.Value(0))
  const [width, setWidth] = useState<number>(0)
  const [localCurrentIndex, setCurrentIndex] = useState<number>(initialIndex)
  const currentIndex = value ?? localCurrentIndex

  const handleTabPress = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      onChange(index)
    },
    [onChange],
  )

  const handleLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      setWidth(nativeEvent.layout.width)
    },
    [setWidth],
  )

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: currentIndex * (width / tabs.length),
      stiffness: 180,
      damping: 25,
      mass: 1,
      useNativeDriver: true,
    }).start()
  }, [currentIndex, slideAnimation, width, tabs.length])

  return (
    <View
      className={cn(segmentedControlVariants({ size }), containerStyle)}
      onLayout={handleLayout}
    >
      <Animated.View
        className="absolute bottom-1 left-1 top-1 rounded-md bg-white"
        style={{
          width: width / tabs.length - 8,
          transform: [{ translateX: slideAnimation }],
        }}
      />
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          activeOpacity={0.7}
          className={cn(tabVariants({ size }))}
          onPress={() => handleTabPress(index)}
        >
          <Text className={cn(textVariants({ active: currentIndex === index }), textStyle)}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
