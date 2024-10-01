import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useFeedInfiniteSearch } from '@/services/record'

import { Feed } from './Feed'

export function FeedMain() {
  const bottomTabBarHeight = useBottomTabBarHeight()
  const { bottom } = useSafeAreaInsets()

  // 전체 검색
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedInfiniteSearch('')

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  const allFeeds = data?.pages.flatMap(page => page) ?? []

  return (
    <Feed
      data={allFeeds}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size="small" /> : null)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: bottomTabBarHeight - bottom,
      }}
    />
  )
}
