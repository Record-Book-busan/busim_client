import { useState } from 'react'
import { View, Text } from 'react-native'

import { MapDetail } from '@/components/map'
import { useLocationToAddr } from '@/services/record'
import { SvgIcon } from '@/shared'

import { RecordFormAction } from './hooks/useRecordForm'
interface Geometry {
  lat: number
  lng: number
}
interface RecordLocationProps {
  location: {
    lng: number
    lat: number
    name: string
  }
  dispatch: React.Dispatch<RecordFormAction>
  isLoading: boolean
}

export const RecordLocation = ({ location, dispatch, isLoading }: RecordLocationProps) => {
  const [currentLocation, setCurrentLocation] = useState<Geometry>(location)
  const { data, refetch } = useLocationToAddr(currentLocation.lat, currentLocation.lng)

  const handleCenterChange = ({ lat, lng }: { lat: number; lng: number }) => {
    setCurrentLocation({ lat, lng })
    refetch().then(() => {
      const name =
        data?.documents[0].address.address_name ||
        data?.documents[0].road_address.address_name ||
        location.name
      dispatch({ type: 'UPDATE_LOCATION', value: { name, lat, lng } })
    })
  }

  return (
    <View className="px-3">
      <View className="my-4 h-32">
        <MapDetail
          geometry={{ lon: location.lng, lat: location.lat }}
          onCenterChange={handleCenterChange}
        />
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
