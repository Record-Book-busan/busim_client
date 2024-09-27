import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'

import { ImagePlaceItem } from '@/components/search'
import { CategoryType, getCategoryText } from '@/constants'
import { useNavigateWithPermissionCheck } from '@/hooks/useNavigationPermissionCheck'
import { useInfiniteRecordList } from '@/services/record'
import { type RecordList } from '@/types/schemas/record'

import type { MyPageStackParamList, RootStackParamList } from '@/types/navigation'
import type { StackNavigationProp } from '@react-navigation/stack'

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<MyPageStackParamList, 'RecordList'>,
  StackNavigationProp<RootStackParamList>
>

export default function RecordListScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRecordList()

  const navigation = useNavigation<NavigationProps>()
  const { navigateWithPermissionCheck } = useNavigateWithPermissionCheck()

  const handleItemPress = (id: number) => {
    navigateWithPermissionCheck({
      navigation,
      routeName: 'MainTab',
      params: {
        screen: 'Record',
        params: {
          screen: 'ReadRecord',
          params: { id },
        },
      },
    })
  }

  const handleBookmarkPress = (id: number) => {
    console.log(id)
  }

  const renderItem = ({ item }: { item: RecordList }) => (
    <ImagePlaceItem
      id={item.id}
      title={item.title}
      category={getCategoryText(item.touristCategory as CategoryType)}
      content={item?.content}
      onPressMove={() => handleItemPress(item.id)}
      imageUrl={item.thumbnailUrl || ''}
      isBookMarked={false}
      onPressBookMark={handleBookmarkPress}
    />
  )

  return (
    <View className="flex-1 bg-white">
      <View className="px-4">
        <FlatList
          data={data.pages.flatMap(page => page)}
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
