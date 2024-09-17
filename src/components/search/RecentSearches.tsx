import { Text, FlatList, View } from 'react-native'

import { PlaceItem } from '@/components/search'

import type { RecordRecentSearch } from '../record'
import type { Place } from '@/types/schemas/place'

type SearchItemType = Place | RecordRecentSearch

type RecentSearchesProps<T extends SearchItemType> = {
  recentSearches: T[]
  onItemPress: (item: T) => void
  onItemDelete: (id: number) => void
}

export function RecentSearches<T extends SearchItemType>({
  recentSearches,
  onItemPress,
  onItemDelete,
}: RecentSearchesProps<T>) {
  const renderItem = ({ item }: { item: T }) => {
    const id = item.id
    const title = 'name' in item ? item.name : item.query
    const address = 'address' in item ? item.address : undefined

    return (
      <View className="px-5">
        <PlaceItem
          id={id}
          title={title}
          address={address}
          onPressMove={() => onItemPress(item)}
          onPressDel={() => onItemDelete(id)}
        />
      </View>
    )
  }

  return (
    <>
      <Text className="px-5 pb-1 pt-5 text-sm font-light text-gray-700">최근 검색 기록</Text>
      {recentSearches.length > 0 ? (
        <FlatList
          data={recentSearches}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${'id' in item ? item.id : index}-${index}`}
        />
      ) : (
        <Text className="flex-1 px-5 py-4 text-gray-700">최근 검색 기록이 없습니다.</Text>
      )}
    </>
  )
}
