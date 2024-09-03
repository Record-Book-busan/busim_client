import React from 'react'
import { Dimensions, Platform } from 'react-native'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import { type Edge, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

const height = Dimensions.get('window').height

// TODO: 안드로이드 테스트가 필요함
export function KeyboardAvoidingView({
  edge,
  children,
}: {
  edge?: Extract<Edge, 'top' | 'bottom'>
  children: React.ReactNode
}) {
  const keyboard = useAnimatedKeyboard()
  const insets = useSafeAreaInsets()
  const { y } = useSafeAreaFrame()
  const bottomSafeAreaHeight = Platform.OS === 'ios' ? y : 0

  const animatedStyles = useAnimatedStyle(() => ({
    maxHeight:
      height -
      keyboard.height.value -
      bottomSafeAreaHeight -
      (edge?.includes('top') ? insets.top : 0),
  }))

  return (
    <Animated.View className="flex-1" style={animatedStyles}>
      {children}
    </Animated.View>
  )
}
