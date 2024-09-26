import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { type RecordRecentSearch, useRecentSearch } from '@/components/record'
import { RecentSearches } from '@/components/search'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'

import type { RecordStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type RecordSearchScreenNavigationProp = StackNavigationProp<RecordStackParamList, 'RecordSearch'>
type RecordSearchScreenRouteProp = RouteProp<RecordStackParamList, 'RecordSearch'>

export default function RecordSearchScreen() {
  const navigation = useNavigation<RecordSearchScreenNavigationProp>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()
  const route = useRoute<RecordSearchScreenRouteProp>()
  const [query, setQuery] = useState('')
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearch()

  useEffect(() => {
    if (route.params?.query) {
      setQuery(route.params.query)
    }
  }, [route.params?.query])

  const handleSearch = () => {
    if (query.trim()) {
      addRecentSearch(query)
      navigateWithPermissionCheck({
        navigation,
        routeName: 'RecordResult',
        params: { query },
      })
    }
  }

  const handleInputChange = (text: string) => {
    setQuery(text)
  }

  const navigateToResult = (item: RecordRecentSearch) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'RecordResult',
      params: { query: item.query },
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
        <RecentSearches
          recentSearches={recentSearches}
          onItemPress={navigateToResult}
          onItemDelete={removeRecentSearch}
        />
      </View>
    </SafeScreen>
  )
}
