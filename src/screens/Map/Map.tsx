import { type BottomTabNavigationProp, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useState, useRef, useCallback } from 'react'
import { View, Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SafeScreen, SearchBarView, Categories } from '@/components/common'
import { PlaceMapView, EyeButton, MapFAB } from '@/components/map'
import { CategoryType } from '@/constants/data'
import { useLocation } from '@/hooks/useLocation'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { RootStackParamList } from '@/types/navigation'

import { RecommendSheet } from './RecommendSheet'

type MapScreenProps = {
  route: { params?: { categories?: CategoryType[] } }
}

export default function MapScreen({ route }: MapScreenProps) {
  const { location, myPositionValid, refreshLocation } = useLocation()
  const [activeCategory, setActiveCategory] = useState<string[]>([])
  const [eyeState, setEyeState] = useState(true)
  const [isLocationPressed, setIsLocationPressed] = useState(false)
  const [isToiletPressed, setIsToiletPressed] = useState(false)
  const [isParkingPressed, setIsTrafficPressed] = useState(false)
  // const [isBookMarkPressed, setIsBookMarkPressed] = useState(false)
  const searchBarHeight = useRef(0)
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList, 'MainTab'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleCategoryChange = useCallback((cat: string[]) => {
    setActiveCategory(cat)
  }, [])

  const handleSearchBarPress = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: { screen: 'Search' },
    })
  }

  const handleEyePress = () => {
    setEyeState(prev => !prev)
  }

  const handleLocationPress = useCallback(() => {
    void refreshLocation()
    if (myPositionValid) {
      setIsLocationPressed(prev => !prev)
    } else {
      Alert.alert('서비스 제공 위치가 아닙니다', '부산 외 지역은 서비스 제공 지역이 아닙니다.')
    }
  }, [myPositionValid, refreshLocation])

  const bottomTabBarHeight = useBottomTabBarHeight()

  const handleClickFindWay = () => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'SearchStack',
      params: { screen: 'FindWay' },
    })
  }

  return (
    <SafeScreen
      excludeEdges={['top', 'bottom']}
      statusBarColor={'transparent'}
      textColor={'dark-content'}
      isTranslucent={true}
    >
      {/* 검색바 */}
      <View
        style={{
          position: 'relative',
          marginTop: Platform.OS === 'ios' ? insets.top : insets.top + 12,
        }}
      >
        <View
          onLayout={event => {
            searchBarHeight.current = event.nativeEvent.layout.height
          }}
        >
          <SearchBarView placeholder="장소 검색" onPress={handleSearchBarPress} />
        </View>
        {/* 카테고리 */}
        <View
          className={`absolute left-0 right-0 z-[1px]`}
          style={{
            top: searchBarHeight.current,
          }}
        >
          <Categories
            initCategories={route.params?.categories || []}
            onCategoryChange={handleCategoryChange}
          />
        </View>
        {/* 눈 아이콘 */}
        <View
          className={`absolute right-4 z-[1px]`}
          style={{
            top: searchBarHeight.current,
          }}
        >
          <EyeButton eyeState={eyeState} onPress={handleEyePress} />
        </View>
      </View>

      <View
        className="absolute bottom-12 right-4 z-[2] flex gap-4"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        {/* 길찾기 표시 버튼 */}
        <MapFAB onPress={handleClickFindWay} iconName="findWay" />
        {/* 북마크 표시 버튼 */}
        {/* <MapFAB
          onPress={() => setIsBookMarkPressed(!isBookMarkPressed)}
          iconName="bookmark"
          enabled={isBookMarkPressed}
        /> */}
        {/* 내 위치 버튼 */}
        <MapFAB onPress={handleLocationPress} iconName="position" enabled={isLocationPressed} />
      </View>
      <View
        className="absolute bottom-12 left-4 z-[2] flex gap-4"
        style={{
          paddingBottom: bottomTabBarHeight,
        }}
      >
        {/* 주차장 표시 버튼 */}
        <MapFAB
          onPress={() => setIsTrafficPressed(!isParkingPressed)}
          iconName="parking"
          enabled={isParkingPressed}
        />
        {/* 화장실 표시 버튼 */}
        <MapFAB
          onPress={() => setIsToiletPressed(!isToiletPressed)}
          iconName="toilet"
          enabled={isToiletPressed}
        />
      </View>

      {/* 지도 */}
      <View className="absolute inset-0 h-full w-full">
        <PlaceMapView
          activeCategory={activeCategory}
          eyeState={eyeState}
          location={location}
          isLocationPressed={isLocationPressed}
          isToiletPressed={isToiletPressed}
          isParkingPressed={isParkingPressed}
        />
      </View>

      <RecommendSheet headerHeight={searchBarHeight.current + insets.top} />
    </SafeScreen>
  )
}
