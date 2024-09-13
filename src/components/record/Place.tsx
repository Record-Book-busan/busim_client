import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useLocation } from '@/hooks/useLocation'
import { SvgIcon } from '@/shared'

import { MapView } from '../map'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type MapViewProps = {
  mapType: 'place' | 'record'
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isToiletPressed?: boolean
  isTrafficPressed?: boolean
  refreshed?: boolean
}

const MomorizedMapView = React.memo(
  ({
    mapType,
    activeCategory,
    eyeState,
    location,
    locationPressed,
    isToiletPressed,
    isTrafficPressed,
  }: MapViewProps) => {
    return (
      <MapView
        mapType={mapType}
        activeCategory={activeCategory}
        eyeState={eyeState}
        location={location}
        locationPressed={locationPressed}
        isToiletPressed={isToiletPressed}
        isTrafficPressed={isTrafficPressed}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.activeCategory === nextProps.activeCategory &&
      prevProps.eyeState === nextProps.eyeState &&
      prevProps.locationPressed === nextProps.locationPressed &&
      prevProps.isToiletPressed === nextProps.isToiletPressed &&
      prevProps.isTrafficPressed === nextProps.isTrafficPressed &&
      prevProps.refreshed === nextProps.refreshed &&
      prevProps.mapType === nextProps.mapType
    )
  },
)

/**
 * @todo 지도 연결, 내 위치 받아오기, 기록 작성 페이지로 위치 전달
 */
export function Place() {
  const { location, refreshLocation } = useLocation()
  const [eyeState, setEyeState] = useState(true)
  const [locationPressed, setLocationPressed] = useState(false)
  const [isBookMarked, setIsBookMarked] = useState(false)
  const searchBarHight = useRef(0)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MainTab'>>()

  const handleLocationPress = () => {
    void refreshLocation()
    setLocationPressed(prev => !prev)
  }

  const handleEyePress = () => {
    setEyeState(prev => !prev)
  }

  return (
    <View className="h-full w-full">
      {/* 눈 아이콘 */}
      <View
        className={`absolute right-2 z-[1px]`}
        style={{
          top: searchBarHight.current + 25,
        }}
      >
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={handleEyePress}
          className={`flex items-center justify-center rounded-full p-2 ${eyeState ? 'bg-black' : 'bg-white'}`}
        >
          <SvgIcon name={eyeState ? 'eyeClose' : 'eyeOpen'} />
        </TouchableOpacity>
      </View>

      <View className={`absolute bottom-32 right-4 z-[2px] flex gap-4`}>
        {/* 북마크 아이콘 */}
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => setIsBookMarked(prev => !prev)}
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-white`}
        >
          <SvgIcon
            name="bookmark"
            className={`${isBookMarked ? 'text-BUSIM-blue' : 'text-white'}`}
          />
        </TouchableOpacity>

        {/* 내 위치 아이콘 */}
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={handleLocationPress}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <SvgIcon name="position" />
        </TouchableOpacity>
      </View>

      {/* 지도 웹뷰 */}
      <View className="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
        <MomorizedMapView
          mapType={'record'}
          activeCategory={[]}
          eyeState={eyeState}
          location={location}
          locationPressed={locationPressed}
        />
      </View>

      <View className={`absolute bottom-32 left-4 z-[2px] flex w-2/3 gap-4`}>
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="flex h-12 items-center justify-center rounded-xl bg-white"
          onPress={() => {
            navigation.navigate('RecordStack', { screen: 'CreateRecord' })
          }}
        >
          <Text className="items-center font-bold text-black">여행 기록 작성하기</Text>
          <SvgIcon name="doubleChevronRight" className="absolute right-2 text-black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
