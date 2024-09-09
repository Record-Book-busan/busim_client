import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Animated,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native'

import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/*                                   Tab                                      */
/* -------------------------------------------------------------------------- */

interface TabProps extends ViewProps {
  /** 선택된 탭의 인덱스 */
  value: number
  /** 탭 인덱스가 변경될 때 호출되는 함수 */
  onValueChange: (newValue: number) => void
  /** 인디케이터 표시 여부 */
  disableIndicator?: boolean
  /** 인디케이터 스타일 */
  indicatorStyle?: string
  /** 추가 탭 컨테이너 스타일 */
  containerStyle?: string
}

const TabRoot: React.FC<TabProps> = ({
  value,
  onValueChange,
  disableIndicator = false,
  indicatorStyle,
  containerStyle,
  children,
}) => {
  const [tabLayouts, setTabLayouts] = useState<Array<{ x: number; width: number }>>([])
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const selectedTab = tabLayouts[value]
    if (selectedTab) {
      Animated.timing(translateX, {
        toValue: selectedTab.x,
        duration: 170,
        useNativeDriver: true,
      }).start()
    }
  }, [value, tabLayouts, translateX])

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout
    setTabLayouts(prev => {
      const newLayouts = [...prev]
      newLayouts[index] = { x, width }
      return newLayouts
    })
  }

  return (
    <View className={cn('flex-row justify-evenly', containerStyle)} accessibilityRole="tablist">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<TabItemProps>(child)) {
          return React.cloneElement(child, {
            index,
            isSelected: index === value,
            onPress: () => onValueChange(index),
            onLayout: (event: LayoutChangeEvent) => handleLayout(index, event),
          })
        }
        return child
      })}
      {!disableIndicator && (
        <Animated.View
          className={cn(
            'absolute bottom-[-2px] left-0 right-0 h-0.5 bg-BUSIM-blue',
            indicatorStyle,
          )}
          style={[
            {
              width: tabLayouts[value]?.width || 0,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Tab Item                                  */
/* -------------------------------------------------------------------------- */

interface TabItemProps extends ViewProps {
  index?: number
  isSelected?: boolean
  disabled?: boolean
  onPress?: () => void
  onLayout?: (event: LayoutChangeEvent) => void
  addClassName?: string
}

const TabItem: React.FC<TabItemProps> = ({
  isSelected = false,
  disabled = false,
  onPress,
  onLayout,
  children,
  addClassName,
}) => {
  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected, disabled }}
      className={cn(
        'relative flex-1 items-center rounded-md bg-transparent px-4 py-2 transition-colors duration-200',
        disabled && 'opacity-50',
        addClassName,
      )}
    >
      <Text
        className={cn(
          'text-base',
          isSelected ? 'font-bold text-BUSIM-blue' : 'font-semibold text-gray-500',
          disabled && 'text-gray-400',
        )}
      >
        {children}
      </Text>
    </Pressable>
  )
}

export const Tab = Object.assign(TabRoot, {
  Item: TabItem,
})

export type { TabProps, TabItemProps }
