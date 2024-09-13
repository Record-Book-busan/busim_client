import { View, TextInput, TouchableOpacity, Platform, type TextInputProps } from 'react-native'

import { theme } from '@/theme'
import { cn } from '@/utils/cn'

import { SvgIcon } from '../../shared/SvgIcon'
export interface SearchBarProps extends TextInputProps {
  placeholder?: string
  containerStyle?: string
  onPress?: () => void
}

export function SearchBar({ placeholder, containerStyle, onPress, ...props }: SearchBarProps) {
  return (
    <View>
      <View className={cn('flex-row items-center px-4 pb-4 pt-2', containerStyle)}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="flex-1 flex-row items-center rounded-full bg-white px-4"
        >
          <TextInput
            className={cn(
              'h-11 flex-1 items-center text-base',
              Platform.OS === 'ios' && 'leading-[0px]',
            )}
            placeholder={placeholder}
            placeholderTextColor={theme.colors['BUSIM-gray-light']}
            textAlignVertical="center"
            {...props}
          />
          <TouchableOpacity className="ml-2" onPress={onPress}>
            <SvgIcon name="search" className="text-BUSIM-blue" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
