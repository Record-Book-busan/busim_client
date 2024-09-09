import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'

import { usePlaceInfiniteSearch } from '@/services/search'
import { Tab, TabView } from '@/shared'

import { ImagePlaceItem } from './ImagePlaceItem'

import type { Place } from '@/types/schemas/search'

type SearchResultsProps = {
  query: string
  onItemPress: (place: Place) => void
}

export const SearchResults = React.memo(({ query, onItemPress }: SearchResultsProps) => {
  const [index, setIndex] = useState(0)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePlaceInfiniteSearch(query)

  const allPlaces = data?.pages.flatMap(page => page) ?? []

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      void fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  const handleBookMarkPress = useCallback((id: number) => {
    console.log(id)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: Place }) => (
      <ImagePlaceItem
        id={item.id}
        title={item.name}
        category={item.category}
        address={item.address}
        onPressBookMark={() => handleBookMarkPress(item.id)}
        onPressMove={() => onItemPress(item)}
        isBookMarked={false}
        imageUrl={item.imageUrl}
      />
    ),
    [handleBookMarkPress, onItemPress],
  )

  const ListEmptyComponent = useCallback(
    () => <Text className="p-4">검색 결과가 없습니다.</Text>,
    [],
  )

  const ListFooterComponent = useCallback(
    () => (isFetchingNextPage ? <ActivityIndicator /> : null),
    [isFetchingNextPage],
  )

  return (
    <View className="flex-1 bg-white">
      <Tab value={index} onValueChange={setIndex} containerStyle="border-b-2 border-gray-200">
        <Tab.Item>장소</Tab.Item>
        <Tab.Item>여행 기록</Tab.Item>
      </Tab>
      <TabView value={index} onValueChange={setIndex} disableSwipe>
        <TabView.Item>
          <View className="px-4">
            <FlatList
              data={allPlaces}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={ListFooterComponent}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </TabView.Item>
        <TabView.Item>
          <Text className="p-4">데이터 추가하고 수정해야함!!!</Text>
        </TabView.Item>
      </TabView>
    </View>
  )
})
