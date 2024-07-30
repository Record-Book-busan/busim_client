import { View, TextInput, TouchableOpacity, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import SvgIcon from '../SvgIcon'

const HEADER_CONTENT_HEIGHT = 50
const HEADER_HEIGHT =
  Platform.OS === 'ios' ? HEADER_CONTENT_HEIGHT + 44 : HEADER_CONTENT_HEIGHT + 10
// iOS: 상태바(44) + content 높이
// Android: 상태바(24 - 28) + 액션바(56) TODO: aos에서 확인해보기

function SearchHeader() {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="absolute left-0 right-0 top-0 z-50 bg-white/50"
      style={{
        paddingTop: insets.top,
        height: HEADER_HEIGHT + insets.top,
      }}
    >
      <View className="flex-row items-center px-4" style={{ height: HEADER_CONTENT_HEIGHT }}>
        <TouchableOpacity className="mr-2" onPress={() => console.log('show menu.')}>
          <SvgIcon name="hamburger" className="text-gray-400" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center rounded-full bg-white px-4 py-2 shadow-md">
          <TextInput
            className="h-10 flex-1 text-base focus:border-gray-900"
            placeholder="장소, 버스, 지하철, 주소 검색"
          />
          <TouchableOpacity className="ml-2" onPress={() => console.log('search.')}>
            <SvgIcon name="search" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SearchHeader

export const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT
