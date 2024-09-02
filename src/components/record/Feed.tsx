import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { FlatList, Image, useWindowDimensions, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { StackNavigationProp } from '@react-navigation/stack'

const NUM_COLUMNS = 3

export interface ItemData {
  id: number
  imageUrl: string
  lat: number
  lng: number
  cat1: string
  cat2: number
}

type RootStackParamList = {
  FeedScreen: undefined
  DetailScreen: { item: ItemData }
}

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FeedScreen'>

const Item = ({ item, onPress }: { item: ItemData; onPress: () => void }) => {
  const { width } = useWindowDimensions()
  const size = width / NUM_COLUMNS

  return (
    <TouchableOpacity onPress={onPress} className="p-[1.25px]">
      <Image
        source={{ uri: item.imageUrl }}
        className="h-full w-full"
        style={{ width: size - 4, height: size - 4 }}
      />
    </TouchableOpacity>
  )
}

export function Feed() {
  const navigation = useNavigation<FeedScreenNavigationProp>()
  const bottomTabBarHeight = useBottomTabBarHeight()
  const { bottom } = useSafeAreaInsets()

  const handleItemPress = (item: ItemData) => {
    navigation.navigate('DetailScreen', { item })
  }

  return (
    <View className="flex-1">
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item item={item} onPress={() => handleItemPress(item)} />}
        keyExtractor={item => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{
          paddingBottom: bottomTabBarHeight - bottom,
        }}
      />
    </View>
  )
}

const DATA: ItemData[] = [
  {
    id: 812,
    imageUrl: 'https://picsum.photos/id/1010/300/300',
    lat: 36.123456,
    lng: 130.123456,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 813,
    imageUrl: 'https://picsum.photos/id/1011/300/300',
    lat: 36.234567,
    lng: 130.234567,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 814,
    imageUrl: 'https://picsum.photos/id/1012/300/300',
    lat: 36.345678,
    lng: 130.345678,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 815,
    imageUrl: 'https://picsum.photos/id/1013/300/300',
    lat: 36.456789,
    lng: 130.456789,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 816,
    imageUrl: 'https://picsum.photos/id/1014/300/300',
    lat: 36.56789,
    lng: 130.56789,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 817,
    imageUrl: 'https://picsum.photos/id/1015/300/300',
    lat: 36.678901,
    lng: 130.678901,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 818,
    imageUrl: 'https://picsum.photos/id/1016/300/300',
    lat: 36.789012,
    lng: 130.789012,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 819,
    imageUrl: 'https://picsum.photos/id/1017/300/300',
    lat: 36.890123,
    lng: 130.890123,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 820,
    imageUrl: 'https://picsum.photos/id/1018/300/300',
    lat: 36.901234,
    lng: 130.901234,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 821,
    imageUrl: 'https://picsum.photos/id/1019/300/300',
    lat: 37.012345,
    lng: 131.012345,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 822,
    imageUrl: 'https://picsum.photos/id/1020/300/300',
    lat: 37.123456,
    lng: 131.123456,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 823,
    imageUrl: 'https://picsum.photos/id/1021/300/300',
    lat: 37.234567,
    lng: 131.234567,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 824,
    imageUrl: 'https://picsum.photos/id/1022/300/300',
    lat: 37.345678,
    lng: 131.345678,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 825,
    imageUrl: 'https://picsum.photos/id/1023/300/300',
    lat: 37.456789,
    lng: 131.456789,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 826,
    imageUrl: 'https://picsum.photos/id/1024/300/300',
    lat: 37.56789,
    lng: 131.56789,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 819,
    imageUrl: 'https://picsum.photos/id/1017/300/300',
    lat: 36.890123,
    lng: 130.890123,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 820,
    imageUrl: 'https://picsum.photos/id/1018/300/300',
    lat: 36.901234,
    lng: 130.901234,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 821,
    imageUrl: 'https://picsum.photos/id/1019/300/300',
    lat: 37.012345,
    lng: 131.012345,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 822,
    imageUrl: 'https://picsum.photos/id/1020/300/300',
    lat: 37.123456,
    lng: 131.123456,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 823,
    imageUrl: 'https://picsum.photos/id/1021/300/300',
    lat: 37.234567,
    lng: 131.234567,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 824,
    imageUrl: 'https://picsum.photos/id/1022/300/300',
    lat: 37.345678,
    lng: 131.345678,
    cat1: 'RECORD',
    cat2: 1,
  },
  {
    id: 825,
    imageUrl: 'https://picsum.photos/id/1023/300/300',
    lat: 37.456789,
    lng: 131.456789,
    cat1: 'RECORD',
    cat2: 2,
  },
  {
    id: 826,
    imageUrl: 'https://picsum.photos/id/1024/300/300',
    lat: 37.56789,
    lng: 131.56789,
    cat1: 'RECORD',
    cat2: 3,
  },
  {
    id: 826,
    imageUrl: 'https://picsum.photos/id/1024/300/300',
    lat: 37.56789,
    lng: 131.56789,
    cat1: 'RECORD',
    cat2: 3,
  },
]
