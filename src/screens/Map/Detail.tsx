import { type RouteProp } from '@react-navigation/native'
import { Suspense } from 'react'
import { ScrollView } from 'react-native'

import { SafeScreen } from '@/components/common'
import { MapDetailContent } from '@/components/map'
import { useAnimatedHeader } from '@/hooks/useAnimatedHeader'
import { type PlaceType, usePlaceDetail } from '@/services/place'
import { AnimatedHeader, Typo } from '@/shared'

import type { MapStackParamList } from '@/types/navigation'
import type { SharedValue } from 'react-native-reanimated'

interface MapDetailScreenProps {
  route: RouteProp<MapStackParamList, 'MapDetail'>
}

export default function MapDetailScreen({ route }: MapDetailScreenProps) {
  const { scrollY, handleScroll } = useAnimatedHeader()

  return (
    <SafeScreen excludeEdges={['top']}>
      <Suspense fallback={<Typo>로딩중...</Typo>}>
        <MapDetailHeader id={route.params.id} type={route.params.type} scrollY={scrollY} />
        <ScrollView
          className="flex-1 bg-gray-100"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: 0 }}
        >
          <MapDetailContent id={route.params.id} type={route.params.type} />
        </ScrollView>
      </Suspense>
    </SafeScreen>
  )
}

function MapDetailHeader({
  id,
  type,
  scrollY,
}: {
  id: number
  type: PlaceType
  scrollY: SharedValue<number>
}) {
  const { data } = usePlaceDetail(id, type)
  return (
    <AnimatedHeader
      title={data.title || '장소명'}
      scrollY={scrollY}
      triggerPoint={190}
      initialBackgroundColor="transparent"
      finalBackgroundColor="white"
    />
  )
}
