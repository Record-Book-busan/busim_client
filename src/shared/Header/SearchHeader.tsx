import { cva, type VariantProps } from 'class-variance-authority'
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  type TouchableOpacityProps,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/theme'
import { cn } from '@/utils/cn'

import { SvgIcon } from '../SvgIcon'

const HeaderVariants = cva('', {
  variants: {
    type: {
      map: `absolute left-0 right-0 top-0 z-50`,
      default: '',
    },
  },
  defaultVariants: {
    type: 'default',
  },
})

interface SearchHeaderProps extends VariantProps<typeof HeaderVariants>, TouchableOpacityProps {
  type?: 'default' | 'map'
  placeholder?: string
  containerStyle?: string
}

export function SearchHeader({ type, placeholder, containerStyle, ...props }: SearchHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={cn(HeaderVariants({ type }))}
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className={cn('flex-row items-center px-4 pb-4 pt-2', containerStyle)}>
        <View className="flex-1 flex-row items-center rounded-full bg-white px-4 shadow">
          <TextInput
            className={cn(
              'h-10 flex-1 items-center text-base',
              Platform.OS === 'ios' && 'leading-[0px]',
            )}
            placeholder={placeholder}
            placeholderTextColor={theme.colors['BUSIM-gray-light']}
            textAlignVertical="center"
          />
          <TouchableOpacity className="ml-2" onPress={props.onPress} {...props}>
            <SvgIcon name="search" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
