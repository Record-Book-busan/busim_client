import React, { useRef, useState } from 'react'
import { Pressable, Animated, View, Easing, type PressableProps } from 'react-native'

export interface ButtonPrimitiveProps extends PressableProps {
  /** 버튼 유형 */
  type?: 'container' | 'inner'
  /** 버튼 눌렀을 때 색상 */
  pressedColor?: string
  /** 버튼 호버 시 색상 */
  hoverColor?: string
  /** 버튼 애니메이션 비활성화 여부 */
  disableAnimation?: boolean
  /** 버튼 애니메이션 설정 */
  animationConfig?: Partial<Animated.TimingAnimationConfig>
  children: React.ReactNode
}

export const ButtonPrimitive: React.FC<ButtonPrimitiveProps> = ({
  children,
  disabled,
  onPress,
  disableAnimation = false,
  pressedColor,
  hoverColor,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    setIsPressed(true)
    if (!disableAnimation) {
      Animated.timing(scaleAnim, {
        ...defaultAnimConfig,
        ...props.animationConfig,
      }).start()
    }
  }

  const handlePressOut = () => {
    setIsPressed(false)
    if (!disableAnimation) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 75,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start()
    }
  }

  const renderContent = () => {
    return (
      <Animated.View style={!disableAnimation ? { transform: [{ scale: scaleAnim }] } : undefined}>
        {children}
      </Animated.View>
    )
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...props}
    >
      <Animated.View style={!disableAnimation ? { transform: [{ scale: scaleAnim }] } : undefined}>
        <View className={(isPressed && pressedColor) || ''}>{renderContent()}</View>
      </Animated.View>
    </Pressable>
  )
}

/** 애니메이션 설정 */
export const defaultAnimConfig = {
  toValue: 0.97,
  duration: 90,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true,
}
