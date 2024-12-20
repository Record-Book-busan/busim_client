import { type VariantProps } from 'class-variance-authority'
import React, { useRef, useState } from 'react'
import { Pressable, Animated, View, Easing, type PressableProps } from 'react-native'

import { cn } from '@/utils/cn'

import { defaultAnimConfig } from './ButtonPrimitive'
import { buttonContainerVariants, buttonTextVariants } from './styles'

export interface ButtonProps extends PressableProps {
  /** 버튼 눌렀을 때 색상 */
  pressedColor?: string
  /** 버튼 호버 시 색상 */
  hoverColor?: string
  /** 버튼 애니메이션 비활성화 여부 */
  disableAnimation?: boolean
  /** 버튼 스타일 */
  buttonStyle?: string
  /** 버튼 텍스트 스타일 */
  textStyle?: string
  /** 버튼 애니메이션 설정 */
  animationConfig?: Partial<Animated.TimingAnimationConfig>
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps & VariantProps<typeof buttonContainerVariants>> = ({
  children,
  type = 'touch',
  variant = 'ghost',
  size = 'md',
  disabled,
  onPress,
  buttonStyle,
  textStyle,
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

  const containerVariantStyle = buttonContainerVariants({ variant, size, type, disabled })
  const textVariantStyle = buttonTextVariants({ variant, size })

  const getHoverColor = () => {
    if (hoverColor) return hoverColor
    switch (variant) {
      case 'primary':
        return 'bg-blue-800'
      case 'default':
        return 'bg-gray-100'
      case 'ghost':
        return 'bg-gray-50'
      default:
        return ''
    }
  }

  const isString = typeof children === 'string'

  const renderContent = () => {
    const content = isString ? (
      <Animated.Text
        className={cn(textStyle ? textStyle : textVariantStyle)}
        style={
          type === 'text' && !disableAnimation ? { transform: [{ scale: scaleAnim }] } : undefined
        }
      >
        {children}
      </Animated.Text>
    ) : (
      <Animated.View
        className={cn(textStyle ? textStyle : textVariantStyle)}
        style={
          type === 'text' && !disableAnimation ? { transform: [{ scale: scaleAnim }] } : undefined
        }
      >
        {children}
      </Animated.View>
    )

    return content
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...props}
    >
      <Animated.View
        style={
          (type === 'button' || type === 'touch') && !disableAnimation
            ? { transform: [{ scale: scaleAnim }] }
            : undefined
        }
      >
        <View
          className={cn(
            buttonStyle ? buttonStyle : containerVariantStyle,
            isPressed && (pressedColor || getHoverColor()),
          )}
        >
          {renderContent()}
        </View>
      </Animated.View>
    </Pressable>
  )
}
