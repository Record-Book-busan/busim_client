import { cva, type VariantProps } from 'class-variance-authority'
import { type ForwardedRef, forwardRef, useState } from 'react'
import { View, TextInput, Text, Pressable, type TextInputProps, Platform } from 'react-native'

import { cn } from '@/utils/cn'

import { SvgIcon } from './SvgIcon'

// Input variants
const inputVariants = cva('w-full rounded-xl border px-3 text-base leading-[normal]', {
  variants: {
    variant: {
      default: 'h-12 border-gray-300 bg-neutral-100 text-gray-900',
      error: 'border-red-500 bg-red-50 text-red-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Label variants
const labelVariants = cva('mb-1 text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-gray-700',
      error: 'text-red-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Error message variants
const errorVariants = cva('mb-2 text-sm text-gray-900', {
  variants: {
    variant: {
      error: 'text-red-600',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
})

interface InputProps extends TextInputProps, VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  additionalClass?: string
}

/* -------------------------------------------------------------------------- */
/*                                Text Field                                  */
/* -------------------------------------------------------------------------- */
const TextField = forwardRef(
  (
    { additionalClass, variant, label, error, ...props }: InputProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <View className="w-full">
        {label && (
          <Text className={cn(labelVariants({ variant: error ? 'error' : 'default' }))}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            inputVariants({ variant: error ? 'error' : 'default' }),
            isFocused && 'border-slate-300 bg-slate-100',
            additionalClass,
            Platform.OS === 'ios' && 'leading-[0px]',
          )}
          textAlignVertical="center"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && <Text className={cn(errorVariants({ variant: 'error' }))}>{error}</Text>}
      </View>
    )
  },
)

TextField.displayName = 'TextField'

/* -------------------------------------------------------------------------- */
/*                              Clearable Field                               */
/* -------------------------------------------------------------------------- */

const ClearableField = forwardRef((props: InputProps, ref: ForwardedRef<TextInput>) => {
  const [value, setValue] = useState('')

  const handleClear = () => {
    setValue('')
    props.onChangeText?.('')
  }

  return (
    <View className="relative bg-red-500">
      <TextField
        ref={ref}
        value={value}
        onChangeText={text => {
          setValue(text)
          props.onChangeText?.(text)
        }}
        {...props}
      />
      {value.length > 0 && (
        <Pressable
          className="absolute right-3 h-12 items-center justify-center"
          onPress={handleClear}
        >
          <SvgIcon name="xCircleFilled" width={18} height={18} />
        </Pressable>
      )}
    </View>
  )
})

ClearableField.displayName = 'ClearableField'

export { TextField, ClearableField }
