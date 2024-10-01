import { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import { MapDetail } from '@/components/map'
import { useLocationToAddr } from '@/services/record'
import { SvgIcon } from '@/shared'
import { theme } from '@/theme'
import { formatAddress } from '@/utils/format'
import { showToast } from '@/utils/toast'
import { verifyLocation } from '@/utils/validate'

import { useCurrentLocationToAddr } from './hooks/useCurrentLocationToAddr'
import { RecordFormAction } from './hooks/useRecordForm'
interface RecordLocationProps {
  location: {
    lng: number
    lat: number
    name: string
  }
  dispatch: React.Dispatch<RecordFormAction>
}

export const RecordLocation = ({ location, dispatch }: RecordLocationProps) => {
  const { refetch, isLoading: refreshLocationLoading } = useLocationToAddr(
    location.lat,
    location.lng,
  )
  const { getCurrentAddress, isLoading: locationLoading } = useCurrentLocationToAddr()

  useEffect(() => {
    // 현재 내 위치 설정
    const setLocation = async () => {
      try {
        const location = await getCurrentAddress()
        const isValid = await verifyLocation(location)
        if (isValid) dispatch({ type: 'UPDATE_LOCATION', value: location })
      } catch {
        showToast({ text: '현재 위치를 불러오는데 실패했습니다. 다시 시도해주세요.' })
      }
    }
    void setLocation()
  }, [])

  const handleCenterChange = async ({ lat, lng }: { lat: number; lng: number }) => {
    const { data: newLocation } = await refetch()

    if (newLocation) {
      const address = formatAddress(newLocation)
      dispatch({ type: 'UPDATE_LOCATION', value: { name: address.fullAddress, lat, lng } })
    }
  }

  return (
    <>
      <View className="mb-3 h-36 overflow-hidden rounded-lg border border-neutral-200">
        <MapDetail
          geometry={{ lon: location.lng, lat: location.lat }}
          onCenterChange={handleCenterChange}
        />
      </View>
      <View className="mb-1 flex-row items-center">
        <View className="flex-row items-center">
          <SvgIcon name="marker" size={16} className="mr-2 text-neutral-400" />
          <Text className="text-sm text-gray-500">
            {refreshLocationLoading || locationLoading ? (
              <ActivityIndicator size="small" color={theme.colors['BUSIM-blue']} />
            ) : (
              location.name
            )}
          </Text>
        </View>
      </View>
    </>
  )
}
