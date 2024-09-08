import { Text, TouchableOpacity, View } from 'react-native'

import { ImageVariant, SvgIcon } from '@/shared'

import { BookmarkButton } from '../common'

type ImagePlaceItemProps = {
  id: number
  title: string
  category: string
  description: string
  onPressBookMark: (id: number) => void
  onPressMove: (id: number) => void
  isBookMarked: boolean
  imageUrl: string
}

export function ImagePlaceItem({
  id,
  title,
  category,
  description,
  onPressBookMark,
  onPressMove,
  isBookMarked,
  imageUrl,
}: ImagePlaceItemProps) {
  return (
    <View className="flex flex-row border border-y-[#DBDCE5] px-2 py-4">
      <View className="flex flex-row">
        <ImageVariant className="h-24 w-20" source={{ uri: imageUrl }} />
        <View className="left-[-75px] top-1">
          <BookmarkButton isBookMarked={isBookMarked} onPress={() => onPressBookMark(id)} />
        </View>
      </View>
      <View className="flex flex-auto">
        <Text>{title}</Text>
        <View className="flex flex-row items-center">
          <SvgIcon name="category" />
          <Text className="ml-1">{category}</Text>
        </View>
        <View className="flex flex-row items-center">
          <SvgIcon name="explain" />
          <Text className="ml-1">{description}</Text>
        </View>
      </View>
      <View className="flex w-8 justify-center">
        <TouchableOpacity
          className="flex h-8 items-center justify-center rounded-full bg-[#2653B0]"
          onPress={() => onPressMove(id)}
        >
          <SvgIcon name="arrowRightWhite" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
