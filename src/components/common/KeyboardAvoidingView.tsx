import React from 'react'
import { Dimensions, Platform } from 'react-native'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

const height = Dimensions.get('window').height

// TODO: SafeScreen에 따라서 maxHeight 계산 조정이 필요함. 확인해볼것..
export function KeyboardAvoidingView({ children }: { children: React.ReactNode }) {
  const keyboard = useAnimatedKeyboard()
  const { top } = useSafeAreaInsets()
  const { y } = useSafeAreaFrame()
  const bottomSafeAreaHeight = Platform.OS === 'ios' ? y : 0

  const animatedStyles = useAnimatedStyle(() => ({
    maxHeight: height - keyboard.height.value - bottomSafeAreaHeight - top,
  }))

  return (
    <Animated.View className="flex-1" style={animatedStyles}>
      {children}
    </Animated.View>
  )
}
