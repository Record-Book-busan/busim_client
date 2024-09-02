import { cva, type VariantProps } from 'class-variance-authority'
import { type ForwardedRef, forwardRef, useState } from 'react'
import { Text, TextInput, View, type TextInputProps } from 'react-native'

import { cn } from '@/utils/cn'

import { TextField } from './TextField'

const textAreaVariants = cva('px-3 py-2 ', {
  variants: {
    size: {
      sm: 'h-24',
      md: 'h-36',
      lg: 'h-48',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface TextAreaProps extends TextInputProps, VariantProps<typeof textAreaVariants> {
  /* TextArea의 크기를 설정합니다 */
  size?: 'sm' | 'md' | 'lg'
  /* 글자수를 표시합니다 */
  showCount?: boolean
  /* 최대 글자수를 설정합니다 */
  maxLength?: number
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  (
    {
      style,
      size = 'md',
      placeholderTextColor,
      showCount = false,
      maxLength,
      ...props
    }: TextAreaProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const [count, setCount] = useState(0)

    const handleChangeText = (text: string) => {
      if (maxLength && text.length > maxLength) {
        text = text.slice(0, maxLength)
      }
      setCount(text.length)
      props.onChangeText?.(text)
    }

    return (
      <View className="relative">
        <TextField
          ref={ref}
          textAlignVertical="top"
          {...props}
          multiline
          onChangeText={handleChangeText}
          maxLength={maxLength}
          className={cn(textAreaVariants({ size }))}
        />
        {showCount && (
          <Text className="absolute bottom-3 right-3 text-xs text-gray-500">
            {count}/{maxLength || 'ထ'}
          </Text>
        )}
      </View>
    )
  },
)

TextArea.displayName = 'TextArea'
