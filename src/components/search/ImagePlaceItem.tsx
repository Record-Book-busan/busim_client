import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ImageVariant, SvgIcon } from '@/shared'

type ImagePlaceItemProps = {
  id: string
  title: string
  category: string
  description: string
  onPressBookMark: (id: string) => void
  onPressMove: (id: string) => void
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
  const [bookMark, setBookMark] = useState(isBookMarked)

  useEffect(() => {
    setBookMark(isBookMarked)
  }, [isBookMarked])

  return (
    <View className="flex flex-row border border-y-[#DBDCE5] px-2 py-4">
      <View className="flex flex-row">
        <ImageVariant className="h-24 w-20" source={{ uri: imageUrl }} />
        <TouchableOpacity onPress={() => onPressBookMark(id)}>
          <SvgIcon
            className="left-[-75px] top-2 z-50 p-2"
            name={`${bookMark ? 'bookmarkYellow' : 'bookmarkWhite'}`}
          />
        </TouchableOpacity>
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
