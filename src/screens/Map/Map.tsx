import { type BottomTabNavigationProp, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { View, Platform, type LayoutChangeEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SafeScreen, SearchBarView, Categories } from '@/components/common'
import { PlaceMapView, EyeButton, MapFAB } from '@/components/map'
import { CategoryType } from '@/constants/data'
import { AuthStackParamList } from '@/types/navigation'

import { RecommendSheet } from './RecommendSheet'

type MapScreenProps = {
  route: { params?: { categories?: CategoryType[] } }
}

export default function MapScreen({ route }: MapScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string[]>([])
  const [eyeState, setEyeState] = useState(true)
  const [isToiletPressed, setIsToiletPressed] = useState(false)
  const [isParkingPressed, setIsTrafficPressed] = useState(false)
  const [searchBarHeight, setSearchBarHeight] = useState(0)
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<BottomTabNavigationProp<AuthStackParamList, 'MainTab'>>()

  const handleCategoryChange = useCallback((cat: string[]) => {
    setActiveCategory(cat)
  }, [])

  const handleSearchBarPress = () => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
    })
  }

  const handleEyePress = () => {
    setEyeState(prev => !prev)
  }

  const bottomTabBarHeight = useBottomTabBarHeight()

  const onSearchBarLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setSearchBarHeight(height)
  }, [])

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
        <View onLayout={onSearchBarLayout}>
          <SearchBarView placeholder="장소 검색" onPress={handleSearchBarPress} />
        </View>
        {/* 카테고리 */}
        {searchBarHeight > 0 && (
          <View
            className={`absolute left-0 right-0 z-[1px]`}
            style={{
              top: searchBarHeight,
            }}
          >
            <Categories
              initCategories={route.params?.categories || []}
              onCategoryChange={handleCategoryChange}
            />
          </View>
        )}
        {/* 눈 아이콘 */}
        {searchBarHeight > 0 && (
          <View
            className={`absolute right-4 z-[1px]`}
            style={{
              top: searchBarHeight,
            }}
          >
            <EyeButton eyeState={eyeState} onPress={handleEyePress} />
          </View>
        )}
      </View>
      <View
        className="absolute bottom-12 left-4 z-[2] flex gap-2"
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
          isToiletPressed={isToiletPressed}
          isParkingPressed={isParkingPressed}
        />
      </View>

      <RecommendSheet headerHeight={searchBarHeight + insets.top} />
    </SafeScreen>
  )
}
