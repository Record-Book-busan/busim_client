import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useState } from 'react'
import { Alert, View } from 'react-native'

import { useLocation } from '@/hooks/useLocation'

import { MapFAB, RecordMapView } from '../map'

export function Place() {
  const { location, myPositionValid, refreshLocation } = useLocation()
  const [isLocationPressed, setIsLocationPressed] = useState(false)

  const handleLocationPress = () => {
    void refreshLocation()

    if (myPositionValid) {
      setIsLocationPressed(prev => !prev)
    } else {
      Alert.alert('서비스 제공 위치가 아닙니다', '부산 외 지역은 서비스 제공 지역이 아닙니다.', [
        { text: '확인', style: 'default' },
      ])
    }
  }

  const bottomTabBarHeight = useBottomTabBarHeight()

  return (
    <View className="mt-1 flex-1">
      {/* 내 위치 버튼 */}
      <View
        className="absolute bottom-6 right-4 z-[2] flex gap-4"
        style={{
          paddingBottom: bottomTabBarHeight - 10,
        }}
      >
        <MapFAB onPress={handleLocationPress} iconName="position" enabled={isLocationPressed} />
      </View>

      {/* 지도 웹뷰 */}
      <View className="flex-1">
        <RecordMapView location={location} isLocationPressed={isLocationPressed} />
      </View>
    </View>
  )
}
