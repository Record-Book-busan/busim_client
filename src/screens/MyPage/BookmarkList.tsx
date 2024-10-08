import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { View, Text, Platform, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Categories, FlatList } from '@/components/common'
import { CATEGORY, getCategoryText, type CategoryType } from '@/constants'
import { PlaceType } from '@/services/place'
import { SegmentedControl, SvgIcon } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

import type { MyPageStackParamList, AuthStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

interface Bookmark {
  id: number
  title: string
  address: string
  cat1: PlaceType
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
  StackNavigationProp<AuthStackParamList>
>

const generateMockData = (type: PlaceType, page: number): BookmarkResponse => {
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
    queryKey: ['bookmarks', index === 0 ? 'place' : 'record'] as const,
    queryFn: ({ pageParam = 0, queryKey }) =>
      new Promise<BookmarkResponse>(resolve =>
        setTimeout(() => resolve(generateMockData(queryKey[1] as PlaceType, pageParam)), 500),
      ),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  })

  const handleItemPress = (item: Bookmark) => {
    if (index === 0) {
      /** 검색 디테일 화면으로 이동 */
      navigation.navigate('MapStack', {
        screen: 'MapDetail',
        params: {
          id: item.id,
          type: item.cat1,
        },
      })
    } else {
      /** 기록 디테일 화면으로 이동 */
      navigation.navigate('MainTab', {
        screen: 'Record',
        params: {
          screen: 'ReadRecord',
          params: {
            id: item.id,
          },
        },
      })
    }
  }

  const [filiteredDatas, setFiliteredDatas] = useState<Bookmark[]>([])
  const [activeCategories, setActiveCategories] = useState<CategoryType[]>([])

  const handleCategoryChange = (categories: CategoryType[]) => {
    setActiveCategories(categories)
  }

  useEffect(() => {
    data?.pages.flatMap(page => {
      const filteredCategories =
        activeCategories.length === 0
          ? page.content
          : page.content.filter(c => {
              return activeCategories.some(activeCategory => activeCategory === c.cat2)
            })

      setFiliteredDatas(filteredCategories)
    })
  }, [data, activeCategories])

  return (
    <View className="bg-white">
      <FlatList
        data={filiteredDatas}
        HeaderComponent={
          <View className="mt-4 w-full border-t-8 border-[#F5F5F5] pt-4">
            <Categories
              initCategories={['TOURIST_SPOT']}
              onCategoryChange={handleCategoryChange}
              isBookmark={true}
            />
          </View>
        }
        StickyElementComponent={
          <View className="mb-8 items-center justify-center bg-white px-5">
            <SegmentedControl
              tabs={['장소', '기록']}
              value={index}
              onChange={setIndex}
              size="sm"
              textStyle="text-xs"
              containerStyle="w-36 rounded-full"
            />
          </View>
        }
        renderItem={({ item }: { item: Bookmark }) => (
          <ButtonPrimitive
            animationConfig={{ toValue: 0.99 }}
            onPress={() => handleItemPress(item)}
          >
            <View className="flex-row items-center justify-between border-y border-[#DBDCE5] px-5 py-4">
              <View className="flex-1">
                <Text className="mb-1 text-base font-semibold text-gray-800">{item.title}</Text>
                <View className="flex-row items-center">
                  <SvgIcon name="marker" className="mr-2 text-[#00339D]" />
                  <Text
                    className={`text-sm text-[#00339D] ${Platform.OS === 'ios' && 'leading-[0px]'}`}
                  >
                    {getCategoryText(item.cat2)}
                  </Text>
                  <Text
                    className={`text-sm text-[#00339D] ${Platform.OS === 'ios' && 'leading-[0px]'}`}
                  >
                    ⎜
                  </Text>
                  <Text
                    className={`text-sm text-[#00339D] ${Platform.OS === 'ios' && 'leading-[0px]'}`}
                  >
                    {item.address}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="-top-4 rounded-full">
                <SvgIcon name="xCircle" className="text-black" />
              </TouchableOpacity>
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
