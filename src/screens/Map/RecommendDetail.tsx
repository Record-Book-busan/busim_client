import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'

import { SafeScreen } from '@/components/common'
import { ImagePlaceItem } from '@/components/search'
import { CategoryType, getCategoryText } from '@/constants'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { PlaceType, useSpecialPlace } from '@/services/place'
import { Typo } from '@/shared'

import type { RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type PlaceItemType = {
  id: number
  title: string
  category: string
  content: string
  imageUrl: string
}

export default function RecommendDetail() {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRecordList()
  const { data: placeData } = useSpecialPlace({
    lat: 35.2002495716857,
    lng: 129.16,
    level: 'LEVEL_10',
    // restaurantCategories: 'SPECIAL_RESTAURANT',
    restaurantCategories: '',
    touristCategories: 'TOURIST_SPOT',
    isEnabled: true,
  })
  const [index, setIndex] = useState<number>(1)
  const [chunkArray, setChunkArray] = useState<PlaceItemType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'MapStack'>>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  useEffect(() => {
    console.log(`index: ${index}`)
    setIsLoading(true)

    if (placeData) {
      const definePlaces: PlaceItemType[] = placeData.map(place => {
        return {
          id: place.id,
          title: place.title,
          category: getCategoryText(place.touristCat2 as CategoryType),
          content: place.report,
          imageUrl: place.imageUrl2,
        } as PlaceItemType
      })

      setChunkArray(definePlaces.slice(0, 10 * index))
    }

    setIsLoading(false)
  }, [placeData, index])

  const handleItemPress = useCallback((id: number) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MapStack',
      params: {
        screen: 'MapDetail',
        params: {
          id: id,
          // type: 'restaurant' as PlaceType,
          type: 'tourist' as PlaceType,
        },
      },
    })
  }, [])

  const renderItem = ({ item }: { item: PlaceItemType }) => (
    <ImagePlaceItem
      id={item.id}
      title={item.title}
      category={item?.category}
      content={item?.content}
      onPressMove={() => handleItemPress(item.id)}
      imageUrl={item.imageUrl || ''}
    />
  )

  return (
    <SafeScreen excludeEdges={['top']}>
      <View className="flex-1 bg-white">
        <FlatList
          data={chunkArray}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => setIndex(prev => prev + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Typo className="p-4 text-gray-700">작성한 기록이 없습니다.</Typo>
            </View>
          }
          ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
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
