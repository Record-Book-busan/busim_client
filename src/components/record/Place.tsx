import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'

import { useLocation } from '@/hooks/useLocation'
import { navigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { SvgIcon, Typo } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import { MapFAB, RecordMapView } from '../map'

export function Place() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CreateRecordStack'>>()
  const { location, myPositionValid, refreshLocation } = useLocation()
  const [isBookMarkPressed, setIsBookMarkPressed] = useState(false)
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
      <View
        className="absolute bottom-4 right-4 z-[2] flex gap-4"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        {/* 북마크 표시 버튼 */}
        <MapFAB
          onPress={() => setIsBookMarkPressed(!isBookMarkPressed)}
          iconName="bookmark"
          enabled={isBookMarkPressed}
        />
        {/* 내 위치 버튼 */}
        <MapFAB onPress={handleLocationPress} iconName="position" enabled={isLocationPressed} />
      </View>

      <View className={`absolute bottom-20 left-4 z-[2px] flex w-3/4 gap-4`}>
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="flex h-14 items-start justify-center rounded-xl bg-white px-4"
          onPress={() => {
            navigateWithPermissionCheck({
              navigation,
              routeName: 'CreateRecordStack',
              params: {
                screen: 'CreateRecord',
              },
            })
          }}
        >
          <View>
            <Typo className="text-base font-bold text-black">여행 기록 작성하기</Typo>
            <Typo className="text-xs text-[#ECA39D]">현위치로 기록이 남겨집니다.</Typo>
          </View>
          <SvgIcon name="doubleChevronRight" className="absolute right-2 text-black" />
        </TouchableOpacity>
      </View>

      {/* 지도 웹뷰 */}
      <View className="flex-1">
        <RecordMapView location={location} isLocationPressed={isLocationPressed} />
      </View>
    </View>
  )
}
