import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'

import { ImagePlaceItem } from '@/components/search'
import {
  type RecordList,
  type RecordListResponse,
  RecordListResponseSchema,
  RecordListSchema,
} from '@/types/schemas/record'

import type { MyPageStackParamList, RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<MyPageStackParamList, 'RecordList'>,
  StackNavigationProp<RootStackParamList>
>

export default function RecordListScreen() {
  // FIXME: 백엔드 api 수정되면 주석해제!!
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRecordList()

  // FIXME: 백엔드 api 수정되면 제거!!!
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<RecordListResponse>({
      queryKey: ['posts'],
      queryFn: ({ pageParam = 1 }) => fetchMockData(pageParam as number),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.last) return undefined
        return allPages.length + 1
      },
      initialPageParam: 1,
    })

  const navigation = useNavigation<NavigationProps>()

  const handleItemPress = (id: number) => {
    navigation.navigate('MainTab', {
      screen: 'Record',
      params: {
        screen: 'ReadRecord',
        params: { id },
      },
    })
  }

  const renderItem = ({ item }: { item: RecordList }) => (
    <ImagePlaceItem
      id={item.id}
      title={item.title}
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
const generateMockData = (page: number, pageSize = 10): RecordListResponse => {
  const startId = (page - 1) * pageSize + 1
  const content = Array.from({ length: pageSize }, (_, index) => ({
    id: startId + index,
    imageUrl: `/postImage/image${startId + index}.jpg`,
    title: `Title ${startId + index}`,
    content: `Content for post ${startId + index}`,
    lat: 35 + Math.random(),
    lng: 123 + Math.random(),
  }))

  const response: RecordListResponse = {
    content: content.map(item => RecordListSchema.parse(item)),
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

  return RecordListResponseSchema.parse(response)
}

export const fetchMockData = async (page: number): Promise<RecordListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500)) // 네트워크 지연 시뮬레이션
  return generateMockData(page)
}
