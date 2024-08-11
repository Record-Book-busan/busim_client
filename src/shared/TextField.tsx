import { useState } from 'react'
import { TextInput as DefaultTextInput, Platform, TextInputProps } from 'react-native'

export default function TextField({ placeholderTextColor, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleEndEditing = () => {
    setIsFocused(false)
  }

  return (
    <DefaultTextInput
      {...props}
      onFocus={handleFocus}
      onEndEditing={handleEndEditing}
      className={`focus:ring-sky-500' h-12 w-full rounded-xl border border-gray-200 bg-neutral-100 px-4 text-gray-900 focus:outline-none ${isFocused && Platform.OS !== 'web' ? 'bg-slate-100' : ''}`}
      placeholderTextColor={placeholderTextColor || 'text-red-500'}
    />
  )
}
