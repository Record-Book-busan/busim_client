import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Categories, SafeScreen, SearchBar } from '@/components/common'
import { MapView } from '@/components/map'

import { RecommendSheet } from './RecommendSheet'

function MapScreen() {
  const [activeCategory, setActiveCategory] = useState<number[]>([])
  const [searchBarHeight, setSearchBarHeight] = useState(0)

  const handleCategoryChange = (catId: number[]) => {
    console.log('선택한 카테고리 id:', catId)
    setActiveCategory(catId)
  }

  // 전체 헤더 높이 계산
  const headerHeight = useMemo(() => searchBarHeight, [searchBarHeight])
  const handleSearchBarHeightChange = useCallback((height: number) => {
    setSearchBarHeight(height)
  }, [])

  return (
    <SafeScreen excludeEdges={['top']}>
      {/* 검색바 */}
      <SearchBar type="map" placeholder="장소 검색" onHeightChange={handleSearchBarHeightChange} />
      {/* 카테고리 */}
      <View
        className={`absolute left-0 right-0 z-[1px]`}
        style={{
          top: headerHeight,
        }}
      >
        <Categories onCategoryChange={handleCategoryChange} />
      </View>
      {/* 지도 웹뷰 */}
      <MapView activeCategory={activeCategory} />

      {/* 하단 추천 시트 */}
      <RecommendSheet headerHeight={headerHeight} />
    </SafeScreen>
  )
}

export default MapScreen
