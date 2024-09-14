import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BookmarkButton, FlatList } from '@/components/common'
import { CATEGORY, getCategoryText, type CategoryType } from '@/constants'
import { SegmentedControl } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

import type { MyPageStackParamList, RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type BookmarkType = 'PLACE' | 'RECORD'

interface Bookmark {
  id: number
  title: string
  address: string
  cat1: BookmarkType
  cat2: CategoryType
  isBookmarked: boolean
}

interface BookmarkResponse {
  content: Bookmark[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  last: boolean
}

type BookMarkListNavigationProps = CompositeNavigationProp<
  StackNavigationProp<MyPageStackParamList, 'BookMarkList'>,
  StackNavigationProp<RootStackParamList>
>

const generateMockData = (type: BookmarkType, page: number): BookmarkResponse => {
  const categoryValues = Object.values(CATEGORY)
  const content = Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i + 1,
    title: `${type} ${page * 10 + i + 1}`,
    address: `부산시 OO구 XX동 ${page * 10 + i + 1}번지`,
    cat1: type,
    cat2: categoryValues[Math.floor(Math.random() * categoryValues.length)] as CategoryType,
    isBookmarked: Math.random() > 0.5,
  }))

  return {
    content,
    pageable: { pageNumber: page, pageSize: 10 },
    last: page >= 3,
  }
}

export default function BookmarkListScreen() {
  const [index, setIndex] = useState(0)
  const { bottom } = useSafeAreaInsets()
  const navigation = useNavigation<BookMarkListNavigationProps>()

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['bookmarks', index === 0 ? 'PLACE' : 'RECORD'] as const,
    queryFn: ({ pageParam = 0, queryKey }) =>
      new Promise<BookmarkResponse>(resolve =>
        setTimeout(() => resolve(generateMockData(queryKey[1], pageParam)), 500),
      ),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  })

  const handleItemPress = (item: Bookmark) => {
    if (index === 0) {
      /** 검색 디테일 화면으로 이동 */
      navigation.navigate('SearchStack', {
        screen: 'Detail',
        params: { id: item.id, type: item.cat2 },
      })
    } else {
      /** 기록 디테일 화면으로 이동 */
      navigation.navigate('RecordStack', {
        screen: 'ReadRecord',
        params: { id: item.id },
      })
    }
  }

  return (
    <View className="bg-white">
      <FlatList
        data={data?.pages.flatMap(page => page.content)}
        HeaderComponent={<View className="pt-3" />}
        StickyElementComponent={
          <View className="items-center justify-center bg-white px-5">
            <SegmentedControl tabs={['장소', '기록']} value={index} onChange={setIndex} size="md" />
          </View>
        }
        renderItem={({ item }: { item: Bookmark }) => (
          <ButtonPrimitive
            animationConfig={{ toValue: 0.99 }}
            onPress={() => handleItemPress(item)}
          >
            <View className="mx-5 flex-row items-center justify-between border-b border-neutral-100 py-3.5">
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-800">{item.title}</Text>
                <View className="flex-row items-center">
                  <Text className="text-sm leading-[0px] text-gray-500">
                    {getCategoryText(item.cat2)}
                  </Text>
                  <Text className="text-sm leading-[0px] text-gray-500">⎜</Text>
                  <Text className="text-sm leading-[0px] text-gray-500">{item.address}</Text>
                </View>
              </View>
              <BookmarkButton
                onPress={() => console.log('Toggle bookmark for', item.id)}
                isBookMarked={item.isBookmarked}
              />
            </View>
          </ButtonPrimitive>
        )}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom }}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <Text className="py-4 text-center text-gray-500">로딩 중...</Text>
          ) : null
        }
        ListEmptyComponent={() =>
          !isLoading && <Text className="py-4 text-center text-gray-500">북마크가 없습니다.</Text>
        }
      />
      {isLoading && <Text className="py-4 text-center text-gray-500">로딩 중...</Text>}
    </View>
  )
}
