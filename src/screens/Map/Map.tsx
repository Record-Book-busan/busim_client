import {
  type NavigationProp,
  type RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Categories, SafeScreen, SearchBarView } from '@/components/common'
import { MapView } from '@/components/map'
import { useForceUpdate } from '@/hooks/useForceUpdate'
import { useLocation } from '@/hooks/useLocation'
import { SvgIcon } from '@/shared'
import { MapStackParamList, RootStackParamList } from '@/types/navigation'

import { RecommendSheet } from './RecommendSheet'
import { CategoryType } from '../../constants/data'

interface MapScreenProps {
  route: RouteProp<MapStackParamList, 'MapHome'>
}

type MapViewProps = {
  mapType: 'place' | 'record'
  activeCategory: string[]
  eyeState: boolean
  location: {
    lng: number
    lat: number
  }
  locationPressed: boolean
  isToiletPressed: boolean
  isTrafficPressed: boolean
  refreshed: boolean
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
    refreshed,
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
        refreshed={refreshed}
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

export default function MapScreen({ route }: MapScreenProps) {
  const { location, myPositionValid, refreshLocation } = useLocation()
  const [activeCategory, setActiveCategory] = useState<string[]>([])
  const [eyeState, setEyeState] = useState(true)
  const [locationPressed, setLocationPressed] = useState(false)
  const [isBookMarked, setIsBookMarked] = useState(false)
  const [isToiletPressed, setIsToiletPressed] = useState(false)
  const [isTrafficPressed, setIsTrafficPressed] = useState(false)
  const [refreshed, setRefreshed] = useState(false)
  const searchBarHight = useRef(0)
  const forceUpdate = useForceUpdate()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  useEffect(() => {
    const categories: CategoryType[] = route.params?.categories || []

    if (
      categories.some(
        category => category === 'NORMAL_RESTAURANT' || category === 'SPECIAL_RESTAURANT',
      )
    ) {
      handleCategoryChange(
        categories.filter(
          category => category === 'NORMAL_RESTAURANT' || category === 'SPECIAL_RESTAURANT',
        ),
      )
    } else {
      handleCategoryChange(
        categories.filter(
          category => category !== 'NORMAL_RESTAURANT' && category !== 'SPECIAL_RESTAURANT',
        ),
      )
    }
  }, [])

  const handleCategoryChange = (catId: string[]) => {
    setActiveCategory(catId)
  }

  const handleSearchBarPress = () =>
    navigation.navigate('SearchStack', {
      screen: 'Search',
    })

  const handleEyePress = () => {
    setEyeState(prev => !prev)
  }

  const handleLocationPress = () => {
    void refreshLocation()

    console.log(myPositionValid)

    if (myPositionValid) {
      setLocationPressed(prev => !prev)
    } else {
      Alert.alert('서비스 제공 위치가 아닙니다', '부산 외 지역은 서비스 제공 지역이 아닙니다.', [
        { text: '확인', style: 'default' },
      ])
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setTranslucent(true)
    }, []),
  )

  return (
    <SafeScreen excludeEdges={['top']}>
      {/* 검색바 */}
      <View
        style={{
          position: 'relative',
          marginTop: insets.top,
        }}
      >
        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout
            searchBarHight.current = height
            forceUpdate()
          }}
        >
          <SearchBarView placeholder="장소 검색" onPress={handleSearchBarPress} />
        </View>

        {/* 카테고리 */}
        <View
          className={`absolute left-0 right-0 z-[1px]`}
          style={{
            top: searchBarHight.current,
          }}
        >
          <Categories
            initCategories={route.params?.categories || []}
            onCategoryChange={handleCategoryChange}
          />
        </View>

        {/* 눈 아이콘 */}
        <View
          className={`absolute right-2 z-[1px]`}
          style={{
            top: searchBarHight.current + 10,
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

      <View className={`absolute bottom-32 left-4 z-[2px] flex gap-4`}>
        {/* 버스 아이콘 */}
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => setIsTrafficPressed(prev => !prev)}
          className={`flex h-11 w-11 items-center justify-center rounded-full ${isTrafficPressed ? 'bg-BUSIM-blue' : 'bg-white'}`}
        >
          <SvgIcon name="bus" className={`${isTrafficPressed ? 'text-white' : 'text-black'}`} />
        </TouchableOpacity>

        {/* 화장실 아이콘 */}
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => setIsToiletPressed(prev => !prev)}
          className={`flex h-11 w-11 items-center justify-center rounded-full ${isToiletPressed ? 'bg-BUSIM-blue' : 'bg-white'}`}
        >
          <SvgIcon name="toilet" className={`${isToiletPressed ? 'text-white' : 'text-black'}`} />
        </TouchableOpacity>
      </View>

      <View className={`absolute bottom-32 left-0 right-0 z-[1px] flex items-center`}>
        {/* 재검색 */}
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => setRefreshed(prev => !prev)}
          className="flex w-48 items-center justify-center rounded-full bg-white"
        >
          <View className="flex w-full flex-row items-center justify-center gap-4 py-2">
            <Text className="font-bold">현지도에서 재검색</Text>
            <SvgIcon name="refresh" className="rotate-45 text-black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 지도 웹뷰 */}
      <View className="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
        <MomorizedMapView
          mapType={'place'}
          activeCategory={activeCategory}
          eyeState={eyeState}
          location={location}
          locationPressed={locationPressed}
          isToiletPressed={isToiletPressed}
          isTrafficPressed={isTrafficPressed}
          refreshed={refreshed}
        />
      </View>

      {/* 하단 추천 시트 */}
      <RecommendSheet headerHeight={searchBarHight.current + insets.top} />
    </SafeScreen>
  )
}
