import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Categories, SafeScreen, SearchBarView } from '@/components/common'
import { MapView } from '@/components/map'
import { useForceUpdate } from '@/hooks/useForceUpdate'
import { SvgIcon } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

import { RecommendSheet } from './RecommendSheet'

function MapScreen() {
  const [activeCategory, setActiveCategory] = useState<number[]>([])
  const [eyeState, setEyeState] = useState(true)
  const [location, setLocation] = useState<{ lng: number; lat: number }>({
    lng: 126.570667,
    lat: 33.450701,
  })
  const [locationPressed, setLocationPressed] = useState(false)
  const [isBookMarked, setIsBookMarked] = useState(false)
  const [isTrafficPressed, setIsTrafficPressed] = useState(false)
  const [refreshed, setRefreshed] = useState(false)
  const searchBarHight = useRef(0)
  const forceUpdate = useForceUpdate()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  const verifyLocation = (lng: number, lat: number) => {
    if (lng < 124 || lng > 132) return false
    if (lat < 33 || lng > 43) return false

    return true
  }

  const getCurrentLocation = () => {
    const currentLocation = location

    Geolocation.getCurrentPosition(
      position => {
        if (verifyLocation(position.coords.longitude, position.coords.latitude)) {
          currentLocation.lng = position.coords.longitude
          currentLocation.lat = position.coords.latitude
        }
      },
      error => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )

    return currentLocation
  }

  useEffect(() => {
    setLocation(getCurrentLocation())
  }, [])

  const handleCategoryChange = (catId: number[]) => {
    console.log('선택한 카테고리 id:', catId)
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
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setLocation(getCurrentLocation())
            setLocationPressed(prev => !prev)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

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
          <SearchBarView onPress={handleSearchBarPress} />
        </View>

        {/* 카테고리 */}
        <View
          className={`absolute left-0 right-0 z-[1px]`}
          style={{
            top: searchBarHight.current + 10,
          }}
        >
          <Categories onCategoryChange={handleCategoryChange} />
        </View>

        {/* 눈 아이콘 */}
        <View
          className={`absolute right-0 z-[1px]`}
          style={{
            top: searchBarHight.current + 10,
          }}
        >
          <TouchableOpacity onPress={handleEyePress} className="px-2">
            <SvgIcon name={eyeState ? 'eyeClose' : 'eyeOpen'} />
          </TouchableOpacity>
        </View>
      </View>

      <View className={`absolute bottom-32 right-4 z-[1px] flex gap-4`}>
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
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

      <View className={`absolute bottom-32 left-4 z-[1px] flex gap-4`}>
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <SvgIcon name="bus" />
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
          onPress={() => console.log('화장실 아이콘 필요하네,,,')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <SvgIcon name="toilet" />
        </TouchableOpacity>
      </View>

      {/* 지도 웹뷰 */}
      <MapView
        activeCategory={activeCategory}
        eyeState={eyeState}
        location={location}
        locationPressed={locationPressed}
        isTrafficPressed={isTrafficPressed}
        refresed={refreshed}
      />

      <View className={`absolute bottom-32 left-0 right-0 z-[0px] flex items-center`}>
        {/* 버스 아이콘 */}
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

      {/* 하단 추천 시트 */}
      <RecommendSheet headerHeight={searchBarHight.current + insets.top} />
    </SafeScreen>
  )
}

export default MapScreen
