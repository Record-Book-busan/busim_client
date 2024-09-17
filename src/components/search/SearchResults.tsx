import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'

import { usePlaceInfiniteSearch } from '@/services/search'
import { Tab, TabView } from '@/shared'

import { ImagePlaceItem } from './ImagePlaceItem'

import type { Place } from '@/types/schemas/place'

type SearchResultsProps = {
  query: string
  onItemPress: (place: Place) => void
}

export const SearchResults = React.memo(({ query, onItemPress }: SearchResultsProps) => {
  const [index, setIndex] = useState(0)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePlaceInfiniteSearch(query)

  const allPlaces = data?.pages.flatMap(page => page) ?? []

  const handleBookMarkPress = useCallback((id: number) => {
    console.log(id)
  }, [])

  const renderItem = ({ item }: { item: Place }) => (
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
  )

  return (
    <View className="flex-1 bg-white">
      <Tab value={index} onValueChange={setIndex} containerStyle="border-b-2 border-gray-200">
        <Tab.Item>장소</Tab.Item>
      </Tab>
      <TabView value={index} onValueChange={setIndex} disableSwipe>
        <TabView.Item>
          <View className="px-4">
            <FlatList
              data={allPlaces}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              onEndReached={() => hasNextPage && fetchNextPage()}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={<Text className="p-4">검색 결과가 없습니다.</Text>}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </TabView.Item>
      </TabView>
    </View>
  )
})
