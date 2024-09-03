import { NavigationProp, useNavigation } from '@react-navigation/native'
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
  isHeaderShown?: boolean
}

export function SearchHeader({
  type,
  placeholder,
  containerStyle,
  isHeaderShown = true,
  ...props
}: SearchHeaderProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'SearchStack'>>()

  const insets = useSafeAreaInsets()

  const moveSearchHandler = () => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { keyword: '', selected: 'place' },
    })
  }

  return (
    <View
      className={cn(HeaderVariants({ type }))}
      style={{
        paddingTop: isHeaderShown ? insets.top : 0,
      }}
    >
      <View className={cn('flex-row items-center px-4 pb-4 pt-2', containerStyle)}>
        <View
          className={`flex-1 flex-row items-center rounded-full bg-white px-4 shadow ${type === 'default' ? 'border border-[#2653B0]' : ''}`}
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
