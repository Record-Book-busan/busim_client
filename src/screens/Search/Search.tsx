import { useNavigation } from '@react-navigation/native'
import { Suspense, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { SearchResults, RecentSearches } from '@/components/search'
import { useRecentSearch } from '@/services/search'

import type { SearchStackParamList } from '@/types/navigation'
import type { Place } from '@/types/schemas/place'
import type { StackNavigationProp } from '@react-navigation/stack'

export default function SearchScreen() {
  const navigation = useNavigation<StackNavigationProp<SearchStackParamList, 'Search'>>()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearch()

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearching(true)
    }
  }

  const handleInputChange = (text: string) => {
    setQuery(text)
    setIsSearching(false)
  }

  const navigateToDetail = (place: Place) => {
    addRecentSearch(place)
    navigation.navigate('Detail', { id: place.id })
  }

  return (
    <SafeScreen>
      <SearchHeader
        placeholder="장소 검색"
        onChangeText={handleInputChange}
        value={query}
        onPress={handleSearch}
        onSubmitEditing={handleSearch}
      />

      <View className="flex-1">
        {!isSearching ? (
          <RecentSearches
            recentSearches={recentSearches}
            onItemPress={navigateToDetail}
            onItemDelete={removeRecentSearch}
          />
        ) : (
          <Suspense fallback={<Text>Loading...</Text>}>
            {query.trim() !== '' && <SearchResults query={query} onItemPress={navigateToDetail} />}
          </Suspense>
        )}
      </View>

      {query && !isSearching && (
        <TouchableOpacity
          onPress={handleSearch}
          className="absolute bottom-5 left-5 right-5 rounded-full bg-blue-500 p-3"
        >
          <Text className="text-center font-bold text-white">검색</Text>
        </TouchableOpacity>
      )}
    </SafeScreen>
  )
}
