import { useNavigation } from '@react-navigation/native'
import { View, ActivityIndicator } from 'react-native'

import { SafeScreen, SearchHeader } from '@/components/common'
import { Feed } from '@/components/record'
import { useFeedInfiniteSearch } from '@/services/search'
import { RecordStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

interface RecordResultScreenProps {
  route: { params?: { query?: string } }
}

export default function RecordResultScreen({ route }: RecordResultScreenProps) {
  const { query = '' } = route.params || {}
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedInfiniteSearch(query)

  const navigation = useNavigation<StackNavigationProp<RecordStackParamList, 'RecordResult'>>()

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  const allFeeds = data?.pages.flatMap(page => page) ?? []

  const handleSearchBarPress = () => navigation.replace('RecordSearch')
  const handleBackPress = () => navigation.navigate('RecordMain')

  return (
    <SafeScreen>
      <SearchHeader
        type="button"
        value={query}
        onPress={handleSearchBarPress}
        onBackPress={handleBackPress}
        disableClear
      />
      <View style={{ flex: 1 }}>
        <Feed
          data={allFeeds}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator size="small" /> : null
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeScreen>
  )
}
