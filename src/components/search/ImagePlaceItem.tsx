import { Text, TouchableOpacity, View } from 'react-native'

import { ImageVariant, SvgIcon } from '@/shared'

type ImagePlaceItemProps = {
  id: string
  title: string
  category: string
  description: string
  onPressBookMark: (id: string) => void
  onPressMove: (id: string) => void
  imageUrl: string
}

export function ImagePlaceItem({
  id,
  title,
  category,
  description,
  onPressBookMark,
  onPressMove,
  imageUrl,
}: ImagePlaceItemProps) {
  return (
    <View className="flex flex-row border border-y-[#DBDCE5] px-2 py-4">
      <View className="flex flex-row">
        <ImageVariant className="h-24 w-20" source={{ uri: imageUrl }} />
        <TouchableOpacity onPress={() => onPressBookMark(id)}>
          <SvgIcon className="left-[-80px] z-50 p-2" name="bookmark" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-auto">
        <Text>{title}</Text>
        <View className="flex flex-row">
          <SvgIcon name="category" />
          <Text className="ml-1">{category}</Text>
        </View>
        <View className="flex flex-row">
          <SvgIcon name="explain" />
          <Text className="ml-1">{description}</Text>
        </View>
      </View>
      <TouchableOpacity className="flex justify-center" onPress={() => onPressMove(id)}>
        <SvgIcon className="bg-[#2653B0]" name="arrowRightBlue" />
      </TouchableOpacity>
    </View>
  )
}
