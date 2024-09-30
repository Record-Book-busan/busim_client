import { cva } from 'class-variance-authority'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Animated,
  Keyboard,
  type TextInputProps,
  Easing,
} from 'react-native'

import { Typo } from '@/shared'
import { SvgIcon } from '@/shared/SvgIcon'
import { theme } from '@/theme'
import { cn } from '@/utils/cn'

const searchBarVariants = cva('flex-row items-center rounded-xl bg-gray-100 px-4', {
  variants: {
    isFocused: {
      true: 'border border-transparent',
      false: 'border border-transparent',
    },
  },
  defaultVariants: {
    isFocused: false,
  },
})

export interface SearchBarProps extends TextInputProps {
  type?: 'button' | 'input'
  placeholder?: string
  containerStyle?: string
  onPress?: () => void
  onCancel?: () => void
  disableClear?: boolean
  setClicked?: () => void
}

export function SearchBar({
  type = 'input',
  placeholder,
  containerStyle,
  onPress,
  onCancel,
  setClicked,
  value: propValue,
  onChangeText: propOnChangeText,
  disableClear,
  ...props
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState('')
  const isControlled = propValue !== undefined
  const value = isControlled ? propValue : internalValue
  const isButtonType = type === 'button'
  const inputRef = useRef<TextInput>(null)
  const animation = useRef(new Animated.Value(0)).current

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start()
  }, [animation])

  const handleBlur = useCallback(() => {
    if (!value) {
      setIsFocused(false)
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start()
    }
  }, [animation, value])

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) {
        setInternalValue(text)
      }
      propOnChangeText?.(text)
    },
    [isControlled, propOnChangeText],
  )

  const handleClear = useCallback(() => {
    console.log('호출!')
    handleChangeText('')
    inputRef.current?.focus()
  }, [handleChangeText])

  const handleCancel = useCallback(() => {
    Keyboard.dismiss()
    handleChangeText('')
    setIsFocused(false)
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
    onCancel?.()
  }, [animation, handleChangeText, onCancel])

  const inputWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '85%'],
  })

  const cancelButtonOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleBlur)
    return () => {
      keyboardDidHideListener.remove()
    }
  }, [handleBlur])

  const WrapperComponent = isButtonType ? Pressable : Animated.View
  const wrapperProps = isButtonType ? { onPress } : { style: { width: inputWidth } }

  return (
    <View className="flex-row items-center">
      <WrapperComponent
        {...wrapperProps}
        className={cn(searchBarVariants({ isFocused }), containerStyle)}
      >
        <SvgIcon name="search" className="ml-3 text-gray-300" />
        <TextInput
          ref={inputRef}
          className={cn('ml-2 h-11 flex-1 text-base', Platform.OS === 'ios' && 'leading-[0px]')}
          placeholder={placeholder}
          placeholderTextColor={theme.colors['BUSIM-gray-light']}
          textAlignVertical="center"
          editable={!isButtonType}
          pointerEvents={isButtonType ? 'none' : 'auto'}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPress={setClicked}
          {...props}
        />
        {value !== '' && !disableClear && (
          <Pressable onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <SvgIcon name="xCircleFilled" className="mr-2.5 text-neutral-300" />
          </Pressable>
        )}
      </WrapperComponent>
      <Animated.View style={{ opacity: cancelButtonOpacity }}>
        <TouchableOpacity className="ml-2 p-1.5" onPress={handleCancel}>
          <Typo className="text-base text-blue-500">취소</Typo>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
