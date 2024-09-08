import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Categories, SafeScreen, SearchBarView } from '@/components/common'
import { MapView } from '@/components/map'
import { useForceUpdate } from '@/hooks/useForceUpdate'
import { RootStackParamList } from '@/types/navigation'

import { RecommendSheet } from './RecommendSheet'

function MapScreen() {
  const [activeCategory, setActiveCategory] = useState<number[]>([])
  const searchBarHight = useRef(0)
  const forceUpdate = useForceUpdate()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'MainTab'>>()

  const handleCategoryChange = (catId: number[]) => {
    console.log('선택한 카테고리 id:', catId)
    setActiveCategory(catId)
  }

  const handleSearchBarPress = () =>
    navigation.navigate('SearchStack', {
      screen: 'Search',
    })

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
          <Categories onCategoryChange={handleCategoryChange} />
        </View>
      </View>
      {/* 지도 웹뷰 */}
      <MapView activeCategory={activeCategory} />

      {/* 하단 추천 시트 */}
      <RecommendSheet headerHeight={searchBarHight.current + insets.top} />
    </SafeScreen>
  )
}

export default MapScreen
