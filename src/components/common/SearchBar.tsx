import { type NavigationProp, useNavigation } from '@react-navigation/native'
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
import { RootStackParamList } from '@/types/navigation'
import { cn } from '@/utils/cn'

import { SvgIcon } from '../../shared/SvgIcon'

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

interface SearchBarProps extends VariantProps<typeof HeaderVariants>, TouchableOpacityProps {
  type?: 'default' | 'map'
  placeholder?: string
  containerStyle?: string
  /** 검색바 높이를 반환하는 함수 */
  onHeightChange?: (height: number) => void
}

export function SearchBar({
  type,
  placeholder,
  containerStyle,
  onHeightChange,
  ...props
}: SearchBarProps) {
  const insets = useSafeAreaInsets()

  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const moveSearchHandler = () => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { keyword: 'test', selected: 'record' },
    })
  }

  return (
    <View
      className={cn(HeaderVariants({ type }))}
      style={{
        paddingTop: insets.top, // safeArea 상단 아래 위치
      }}
      onLayout={event => {
        const { height } = event.nativeEvent.layout
        onHeightChange?.(height)
      }}
    >
      <View className={cn('flex-row items-center px-4 pb-4 pt-2', containerStyle)}>
        <View
          className={`flex-1 flex-row items-center rounded-full bg-white px-4 shadow ${type === 'default' ? 'border border-[#2653b0]' : ''}`}
        >
          <TextInput
            className={cn(
              'h-10 flex-1 items-center text-base',
              Platform.OS === 'ios' && 'leading-[0px]',
            )}
            placeholder={placeholder}
            placeholderTextColor={theme.colors['BUSIM-gray-light']}
            textAlignVertical="center"
          />
          <TouchableOpacity
            className="ml-2"
            onPress={props.onPress || moveSearchHandler}
            {...props}
          >
            <SvgIcon name="search" className="text-BUSIM-blue" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
