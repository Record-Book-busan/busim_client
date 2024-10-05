import { type RouteProp, useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { ActivityIndicator, FlatList, ImageURISource, View } from 'react-native'

import { SafeScreen } from '@/components/common'
import { ImagePlaceItem } from '@/components/search'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { PlaceType, useInfiniteSpecialPlaceList } from '@/services/place'
import { Typo } from '@/shared'

import type { AuthStackParamList, MapStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

interface MapRecommendScreenProps {
  route: RouteProp<MapStackParamList, 'MapRecommend'>
}

type PlaceItemType = {
  images: ImageURISource
  id: number
  title: string
  categories: string[]
  detailedInformation: string
}

export default function RecommendDetail({ route }: MapRecommendScreenProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSpecialPlaceList(
    route.params.category,
  )

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'MapStack'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleItemPress = useCallback((id: number) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MapStack',
      params: {
        screen: 'MapDetail',
        params: {
          id: id,
          type: 'restaurant' as PlaceType,
        },
      },
    })
  }, [])

  const renderItem = ({ item }: { item: PlaceItemType }) => (
    <ImagePlaceItem
      id={item.id}
      title={item.title}
      category={item?.categories[0]}
      content={item?.detailedInformation}
      onPressMove={() => handleItemPress(item.id)}
      imageUrl={item.images.uri}
    />
  )

  return (
    <SafeScreen excludeEdges={['top']}>
      <View className="flex-1 bg-white">
        <FlatList
          data={data.pages.flatMap(page => page)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Typo className="p-4 text-gray-700">작성한 기록이 없습니다.</Typo>
            </View>
          }
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeScreen>
  )
}
