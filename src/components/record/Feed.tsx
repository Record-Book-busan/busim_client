import { type BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import {
  FlatList,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  View,
  type FlatListProps,
} from 'react-native'

import { Typo } from '@/shared'

import type { MainTabParamList, RecordStackParamList } from '@/types/navigation'
import type { FeedType } from '@/types/schemas/record'
import type { StackNavigationProp } from '@react-navigation/stack'

const NUM_COLUMNS = 3

type FeedNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Record'>,
  StackNavigationProp<RecordStackParamList>
>

type FeedProps = Omit<FlatListProps<FeedType>, 'renderItem'>

export function Feed(props: FeedProps) {
  const navigation = useNavigation<FeedNavigationProp>()

  const handleNavigation = (id: number) => {
    navigation.navigate('ReadRecord', { id })
  }

  if (!props.data || props.data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Typo className="font-SemiBold">기록이 없습니다.</Typo>
      </View>
    )
  }

  return (
    <View className="mt-0.5 flex-1">
      <FlatList
        {...props}
        data={props.data}
        renderItem={({ item }) => <Item item={item} onPress={() => handleNavigation(item.id)} />}
        keyExtractor={item => item.id.toString()}
        numColumns={NUM_COLUMNS}
      />
    </View>
  )
}

const Item = ({ item, onPress }: { item: FeedType; onPress: () => void }) => {
  const { width } = useWindowDimensions()
  const size = width / NUM_COLUMNS

  console.log(item.imageUrl)

  return (
    <TouchableOpacity onPress={onPress} className="p-[1.25px]">
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          className="h-full w-full"
          style={{ width: size - 4, height: size - 4 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{ width: size - 4, height: size - 4 }}
          className="items-center justify-center bg-gray-200"
        >
          <Typo>No Image</Typo>
        </View>
      )}
    </TouchableOpacity>
  )
}
