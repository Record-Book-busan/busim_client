import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'

import { ImagePlaceItem } from '@/components/search'
import { type RecordListResponse } from '@/services/record'
import { type RecordList, RecordListSchema } from '@/types/schemas/record'

import type { MyPageStackParamList, RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<MyPageStackParamList, 'RecordList'>,
  StackNavigationProp<RootStackParamList>
>

export default function RecordListScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<RecordListResponse>({
      queryKey: ['posts'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetchMockData(pageParam as number)
        response.content = response.content.map(record => RecordListSchema.parse(record))
        return response
      },
      getNextPageParam: lastPage => {
        if (lastPage.last) return undefined
        return lastPage.pageable.pageNumber + 1
      },
      initialPageParam: 0,
    })

  const navigation = useNavigation<NavigationProps>()

  const handleItemPress = (id: number) => {
    navigation.navigate('RecordStack', {
      screen: 'ReadRecord',
      params: { id },
    })
  }

  const renderItem = ({ item }: { item: RecordList }) => (
    <ImagePlaceItem
      id={item.id}
      title={item.title}
      category={item.cat2}
      content={item.content}
      onPressMove={() => handleItemPress(item.id)}
      imageUrl={item.imageUrl}
    />
  )

  return (
    <View className="flex-1 bg-white">
      <View className="px-4">
        <FlatList
          data={data.pages.flatMap(page => page.content)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text className="p-4">작성한 기록이 없습니다.</Text>}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

// 가라데이터 생성기
const generateMockData = (page: number, pageSize = 10) => {
  const startId = (page - 1) * pageSize + 1
  const content = Array.from({ length: pageSize }, (_, index) => ({
    id: startId + index,
    imageUrl: `/postImage/image${startId + index}.jpg`,
    title: `Title ${startId + index}`,
    content: `Content for post ${startId + index}`,
    cat2: '카테고리',
    lat: 35 + Math.random(),
    lng: 123 + Math.random(),
  }))

  return {
    content,
    pageable: {
      pageNumber: page - 1,
      pageSize,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      offset: (page - 1) * pageSize,
      paged: true,
      unpaged: false,
    },
    first: page === 1,
    last: page === 10,
    size: pageSize,
    number: page - 1,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    numberOfElements: content.length,
    empty: content.length === 0,
  }
}

const fetchMockData = async (page: number) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return generateMockData(page)
}
