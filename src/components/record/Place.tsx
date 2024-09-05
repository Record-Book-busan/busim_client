import { useNavigation } from '@react-navigation/native'
import { Text, TouchableOpacity, View } from 'react-native'

import { ClearableField } from '@/shared'

import { MapDetail } from '../map'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

/**
 * @todo 지도 연결, 내 위치 받아오기, 기록 작성 페이지로 위치 전달
 */
export function Place() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()
  return (
    <View>
      <View className="h-96 w-full">
        <MapDetail geometry={{ lon: 128.1603, lat: 36.1587 }} />
      </View>
      <ClearableField />
      <TouchableOpacity
        className="flex h-12 items-center justify-center bg-blue-400"
        onPress={() => {
          navigation.navigate('RecordStack', { screen: 'CreateRecord' })
        }}
      >
        <Text className="items-center text-white">기록 작성 버튼</Text>
      </TouchableOpacity>
    </View>
  )
}
