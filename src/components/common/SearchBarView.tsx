import { View, TextInput, Platform, Pressable, type PressableProps } from 'react-native'

import { theme } from '@/theme'
import { cn } from '@/utils/cn'

import { SvgIcon } from '../../shared/SvgIcon'

interface SearchBarProps extends PressableProps {
  placeholder?: string
  containerStyle?: string
}

/**
 * SearchBar 형태로 생긴 View 컴포넌트.
 * 별다른 기능은 없습니다.
 */
export function SearchBarView({ placeholder, containerStyle, ...props }: SearchBarProps) {
  return (
    <View className="left-0 right-0 top-0 z-50">
      <Pressable
        className={cn('flex-row items-center px-4 pb-4 pt-2', containerStyle)}
        onPress={props.onPress}
        {...props}
      >
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
              'h-10 flex-1 items-center text-base',
              Platform.OS === 'ios' && 'leading-[0px]',
            )}
            placeholder={placeholder}
            placeholderTextColor={theme.colors['BUSIM-gray-light']}
            textAlignVertical="center"
            editable={false}
            pointerEvents="none"
          />
          <Pressable className="ml-2" pointerEvents="none">
            <SvgIcon name="search" className="text-BUSIM-blue" />
          </Pressable>
        </View>
      </Pressable>
    </View>
  )
}
