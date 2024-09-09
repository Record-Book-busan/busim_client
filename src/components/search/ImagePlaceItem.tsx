import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ImageVariant, SvgIcon } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

import { BookmarkButton } from '../common'

type ImagePlaceItemProps = {
  id: number
  title: string
  category: string
  address?: string
  content?: string
  onPressBookMark?: (id: number) => void
  onPressMove: (id: number) => void
  isBookMarked?: boolean
  imageUrl?: string
}

export function ImagePlaceItem({
  id,
  title,
  category,
  address,
  content,
  onPressBookMark,
  onPressMove,
  isBookMarked,
  // imageUrl,
}: ImagePlaceItemProps) {
  return (
    <View className="border-b border-neutral-200 py-3 last:border-b-0">
      <ButtonPrimitive animationConfig={{ toValue: 0.99 }} onPress={() => onPressMove(id)}>
        <View className="flex-row">
          <View className="mr-3">
            <ImageVariant
              className="aspect-3/4 h-24 w-20 rounded-lg"
              source={{ uri: 'https://via.placeholder.com/640x480' }} // FIXME: 디폴트 이미지 추가 필요!
            />
            {isBookMarked && onPressBookMark && (
              <View className="absolute left-1 top-1">
                <BookmarkButton
                  size={24}
                  isBookMarked={isBookMarked}
                  onPress={() => onPressBookMark(id)}
                />
              </View>
            )}
          </View>
          <View className="mt-2 flex-1 justify-start">
            <Text className="text-base font-semibold text-gray-800">{title}</Text>
            <View className="mt-2 flex-row items-center">
              <SvgIcon name="category" size={14} />
              <Text className="ml-1 text-sm text-gray-500">{category}</Text>
            </View>
            {content && (
              <View className="mt-1 flex-row items-center">
                <SvgIcon name="explain" className="text-gray-400" size={14} />
                <Text className="ml-1 text-sm text-gray-500" numberOfLines={1}>
                  {content}
                </Text>
              </View>
            )}
            {address && (
              <View className="mt-1 flex-row items-center">
                <SvgIcon name="marker" className="text-gray-400" size={14} />
                <Text className="ml-1 text-sm text-gray-500" numberOfLines={1}>
                  {address}
                </Text>
              </View>
            )}
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity
              className="ml-2 h-7 w-7 items-center justify-center rounded-full bg-BUSIM-blue-dark"
              onPress={() => onPressMove(id)}
            >
              <SvgIcon name="arrowRightWhite" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ButtonPrimitive>
    </View>
  )
}
