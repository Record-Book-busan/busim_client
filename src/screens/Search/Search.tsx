import { useNavigation } from '@react-navigation/native'
import { Text, FlatList, View } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { PlaceItem, useRecentSearch, useSearch } from '@/components/search'

import type { SearchStackParamList } from '@/types/navigation'
import type { Place } from '@/types/schemas/search'
import type { StackNavigationProp } from '@react-navigation/stack'

export default function SearchScreen() {
  const navigation = useNavigation<StackNavigationProp<SearchStackParamList, 'Search'>>()
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearch()
  const { query, searchResults, searchPlaces } = useSearch()
  const handleSearch = (text: string) => {
    searchPlaces(text)
  }

  const navigateToDetail = (place: Place) => {
    addRecentSearch(place)
    navigation.navigate('Detail', { id: place.id })
  }

  const keyExtractor = (item: Place) => item.id.toString()

  const displayData = query ? searchResults : recentSearches

  return (
    <SafeScreen>
      <SearchHeader placeholder="장소 검색" onChangeText={handleSearch} value={query} />
      <View className="flex-1">
        {!query && (
          <Text className="px-5 pb-1 pt-5 text-sm font-light text-gray-700">최근 검색 기록</Text>
        )}
        {displayData.length > 0 ? (
          <FlatList
            data={displayData}
            renderItem={({ item }: { item: Place }) => (
              <PlaceItem
                id={item.id}
                title={item.name}
                position={item.address}
                onPressMove={() => navigateToDetail(item)}
                onPressDel={() => removeRecentSearch(item.id)}
              />
            )}
            keyExtractor={keyExtractor}
          />
        ) : (
          <Text className="px-2 py-4">
            {query ? '검색 결과가 없습니다.' : '최근 검색 기록이 없습니다.'}
          </Text>
        )}
      </View>
    </SafeScreen>
  )
}
