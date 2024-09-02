import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Animated,
  PanResponder,
  type ViewProps,
  type PanResponderGestureState,
  type GestureResponderEvent,
} from 'react-native'

import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/*                                  TabView                                   */
/* -------------------------------------------------------------------------- */

interface TabViewProps extends ViewProps {
  /** 현재 선택된 탭의 index */
  value?: number
  /** 탭의 index가 변경될 때 호출되는 함수 */
  onValueChange?: (value: number) => void
  /** 탭 전환 애니메이션 타입 */
  animationType?: 'spring' | 'timing'
  /** 탭 전환 애니메이션 설정 */
  animationConfig?: Omit<Animated.SpringAnimationConfig & Animated.TimingAnimationConfig, 'toValue'>
  /** 탭 컨테이너의 스타일 */
  containerStyle?: string
  /** 탭 아이템 컨테이너의 스타일 */
  tabItemContainerStyle?: string
  /** 탭 전환 스와이프 비활성화 */
  disableSwipe?: boolean
  /** 탭 전환 애니메이션 비활성화 */
  disableTransition?: boolean
  /** 탭 전환 스와이프 시작 시 호출되는 함수 */
  onSwipeStart?: (direction: 'left' | 'right') => void
  /** 탭 전환 스와이프 최소 비율 */
  minSwipeRatio?: number
  /** 탭 전환 스와이프 최소 속도 */
  minSwipeSpeed?: number
}

const DEFAULT_ANIMATION_CONFIG = {
  timing: { duration: 250 },
  spring: { friction: 20, tension: 100 },
}
export const TabViewRoot: React.FC<TabViewProps> = ({
  value = 0,
  children,
  onValueChange = () => {},
  onSwipeStart = () => {},
  animationType = 'timing',
  animationConfig = {},
  containerStyle,
  tabItemContainerStyle,
  disableSwipe = false,
  disableTransition = false,
  minSwipeRatio = 0.4,
  minSwipeSpeed = 1,
}) => {
  const translateX = useRef(new Animated.Value(0))
  const currentIndex = useRef(0)
  const [containerWidth, setContainerWidth] = useState(1)

  const childCount = React.Children.count(children)

  const animate = (toValue: number) => {
    Animated[animationType](translateX.current, {
      toValue,
      useNativeDriver: true,
      ...DEFAULT_ANIMATION_CONFIG[animationType],
      ...animationConfig,
    }).start()
  }

  const releaseResponder = (_: GestureResponderEvent, { dx, vx }: PanResponderGestureState) => {
    const position = dx / -containerWidth
    const shouldSwipe = Math.abs(position) > minSwipeRatio || Math.abs(vx) > minSwipeSpeed
    currentIndex.current += shouldSwipe ? Math.sign(position) : 0
    animate(currentIndex.current)
    onValueChange(currentIndex.current)
  }

  const panResponder = PanResponder.create({
    onPanResponderGrant: (_, { vx }) => {
      onSwipeStart(vx > 0 ? 'left' : 'right')
    },
    onMoveShouldSetPanResponder: (_, { dx, dy, vx, vy }) => {
      const panXInt = Math.floor(currentIndex.current)
      return (
        !((dx > 0 && panXInt <= 0) || (dx < 0 && panXInt >= childCount - 1)) &&
        Math.abs(dx) > Math.abs(dy) * 2 &&
        Math.abs(vx) > Math.abs(vy) * 2.5
      )
    },
    onPanResponderMove: (_, { dx }) => {
      const position = dx / -containerWidth
      translateX.current.setValue(Math.floor(currentIndex.current) + position)
    },
    onPanResponderRelease: releaseResponder,
    onPanResponderTerminate: releaseResponder,
  })

  useEffect(() => {
    if (Number.isInteger(value) && value !== currentIndex.current) {
      animate(value)
      currentIndex.current = value
    }
  }, [value])

  return (
    <View
      className={cn('flex-1', containerStyle)}
      onLayout={({ nativeEvent: { layout } }) => {
        setContainerWidth(layout.width)
      }}
    >
      <Animated.View
        className={cn('absolute inset-0 flex-row items-stretch')}
        style={[
          {
            width: containerWidth * childCount,
            transform: [
              {
                translateX: disableTransition
                  ? -value * containerWidth
                  : translateX.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -containerWidth],
                    }),
              },
            ],
          },
        ]}
        {...(!disableSwipe && panResponder.panHandlers)}
      >
        {React.Children.map(children, (child, index) => (
          <View
            key={index}
            className={cn('flex-1', tabItemContainerStyle)}
            style={{ width: containerWidth }}
          >
            {child}
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*                                TabView Item                                */
/* -------------------------------------------------------------------------- */

type TabViewItemProps = ViewProps

export const TabViewItem: React.FC<TabViewItemProps> = ({ children, ...rest }) => {
  return <View {...rest}>{React.isValidElement(children) && children}</View>
}

export const TabView = Object.assign(TabViewRoot, {
  Item: TabViewItem,
})

export type { TabViewProps, TabViewItemProps }
