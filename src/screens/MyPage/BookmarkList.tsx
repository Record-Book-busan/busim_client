import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'

import { SafeScreen } from '@/components/common'
import { Header } from '@/shared/Header'

type BookmarkType = 'PLACE' | 'RECORD'

interface Bookmark {
  id: number
  title: string
  address: string
  cat1: BookmarkType
  cat2: number
}

interface BookmarkResponse {
  content: Bookmark[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  last: boolean
}

// 가라데이터 생성
const generateMockData = (type: BookmarkType, page: number): BookmarkResponse => {
  const content = Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i + 1,
    title: `${type === 'PLACE' ? '장소' : '기록'} ${page * 10 + i + 1}`,
    address: `부산시 OO구 XX동 ${page * 10 + i + 1}번지`,
    cat1: type,
    cat2: Math.floor(Math.random() * 1000),
  }))

  return {
    content,
    pageable: {
      pageNumber: page,
      pageSize: 10,
    },
    last: page >= 3,
  }
}

// FIXME: 실제 api 연동이 필요합니다
const fetchBookmarks = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number
  queryKey: readonly [string, BookmarkType]
}): Promise<BookmarkResponse> => {
  const [_, type] = queryKey
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockData(type, pageParam))
    }, 500)
  })
}

export default function BookmarkListScreen() {
  const [bookmarkType, setBookmarkType] = useState<BookmarkType>('PLACE')

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['bookmarks', bookmarkType] as const,
    queryFn: fetchBookmarks,
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  })

  const renderItem = useCallback(
    ({ item }: { item: Bookmark }) => (
      <View className="mb-2 rounded-lg bg-white p-4 shadow">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.address}</Text>
        <Text className="text-xs text-gray-500">카테고리: {item.cat2}</Text>
      </View>
    ),
    [],
  )

  const toggleBookmarkType = () => {
    setBookmarkType(prev => (prev === 'PLACE' ? 'RECORD' : 'PLACE'))
  }

  const bookmarks = data?.pages.flatMap(page => page.content) ?? []

  return (
    <SafeScreen>
      <Header title="북마크" />
      <View className="flex-1 bg-gray-100">
        <View className="my-4 flex-row justify-center">
          <TouchableOpacity
            onPress={toggleBookmarkType}
            className={`rounded-full px-4 py-2 ${bookmarkType === 'PLACE' ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <Text className={`${bookmarkType === 'PLACE' ? 'text-white' : 'text-gray-700'}`}>
              장소
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleBookmarkType}
            className={`ml-2 rounded-full px-4 py-2 ${bookmarkType === 'RECORD' ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <Text className={`${bookmarkType === 'RECORD' ? 'text-white' : 'text-gray-700'}`}>
              기록
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <Text className="py-4 text-center">로딩 중...</Text> : null
          }
          ListEmptyComponent={() =>
            !isLoading && <Text className="py-4 text-center">북마크가 없습니다.</Text>
          }
        />

        {isLoading && <Text className="py-4 text-center">로딩 중...</Text>}
      </View>
    </SafeScreen>
  )
}
