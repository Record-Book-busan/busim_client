import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { ActivityIndicator, FlatList, View } from 'react-native'

import { ImagePlaceItem } from '@/components/search'
import { useInfiniteRecordList } from '@/services/record'
import { Typo } from '@/shared'
import { type RecordList } from '@/types/schemas/record'

import type { MainTabParamList, MyPageStackParamList, AuthStackParamList } from '@/types/navigation'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { StackNavigationProp } from '@react-navigation/stack'

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<MyPageStackParamList, 'RecordList'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Record'>,
    StackNavigationProp<AuthStackParamList>
  >
>

export default function RecordListScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRecordList()

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
      content={item?.content}
      onPressMove={() => handleItemPress(item.id)}
      imageUrl={item.imageUrl || ''}
    />
  )

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data.pages.flatMap(page => page)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Typo className="p-4 text-gray-700">작성한 기록이 없습니다.</Typo>
          </View>
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
