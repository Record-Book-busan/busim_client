import { useNavigation } from '@react-navigation/native'
import { Suspense, useState } from 'react'
import { View } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { SearchResults, RecentSearches } from '@/components/search'
import { navigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { useRecentSearch } from '@/services/search'
import { Typo } from '@/shared'

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
    navigateWithPermissionCheck({
      navigation,
      routeName: 'Detail',
      params: { id: place.id, type: getCategoryType(place.category) },
    })
  }

  return (
    <SafeScreen>
      <SearchHeader
        type="input"
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
          <Suspense fallback={<Typo>Loading...</Typo>}>
            {query.trim() !== '' && <SearchResults query={query} onItemPress={navigateToDetail} />}
          </Suspense>
        )}
      </View>
    </SafeScreen>
  )
}

/**
 * 주어진 문자열에 따라 카테고리 타입을 결정하는 함수
 * @param str - 카테고리를 나타내는 문자열
 * @returns 'restaurant' 또는 'tourist'
 */
export function getCategoryType(str: string): 'restaurant' | 'tourist' {
  const lowercaseStr = str.toLowerCase()
  if (lowercaseStr.includes('특별 맛집') || lowercaseStr.includes('맛집')) {
    return 'restaurant'
  }
  return 'tourist'
}
