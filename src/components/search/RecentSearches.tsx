import React from 'react'
import { Text, FlatList, View } from 'react-native'

import { PlaceItem } from '@/components/search'

import type { Place } from '@/types/schemas/search'

type RecentSearchesProps = {
  recentSearches: Place[]
  onItemPress: (place: Place) => void
  onItemDelete: (id: number) => void
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onItemPress,
  onItemDelete,
}) => (
  <>
    <Text className="px-5 pb-1 pt-5 text-sm font-light text-gray-700">최근 검색 기록</Text>
    {recentSearches.length > 0 ? (
      <FlatList
        data={recentSearches}
        renderItem={({ item }) => (
          <View className="px-5">
            <PlaceItem
              id={item.id}
              title={item.name}
              position={item.address}
              onPressMove={() => onItemPress(item)}
              onPressDel={() => onItemDelete(item.id)}
            />
          </View>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    ) : (
      <Text className="flex-1 px-5 py-4 text-gray-700">최근 검색 기록이 없습니다.</Text>
    )}
  </>
)
