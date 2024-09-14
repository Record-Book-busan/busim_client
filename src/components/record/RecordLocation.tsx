import { View, Text } from 'react-native'

import { MapDetail } from '@/components/map'
import { SvgIcon } from '@/shared'

interface RecordLocationProps {
  location: {
    lng: number
    lat: number
    name: string
  }
  isLoading: boolean
}

export const RecordLocation = ({ location, isLoading }: RecordLocationProps) => {
  return (
    <View className="px-3">
      <View className="my-4 h-32">
        <MapDetail geometry={{ lon: location.lng, lat: location.lat }} />
      </View>
      <View className="mb-4 flex-row items-center">
        <View className="flex-row items-center">
          <SvgIcon name="marker" size={16} className="mr-3 text-neutral-400" />
          <Text className="text-sm text-gray-500">
            {isLoading ? '위치 확인 중...' : location.name}
          </Text>
        </View>
      </View>
    </View>
  )
}
