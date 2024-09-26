import { useEffect, useState } from 'react'
import { ImageURISource, TouchableOpacity, View } from 'react-native'

import { validateImageUri } from '@/services/image'
import { ImageVariant, SvgIcon, Typo } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

import { BookmarkButton } from '../common'

type ImagePlaceItemProps = {
  id: number
  title: string
  category?: string
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
  isBookMarked = false,
  imageUrl,
}: ImagePlaceItemProps) {
  const [imageUri, setImageUri] = useState<ImageURISource>()

  useEffect(() => {
    const fetchImageUri = async () => {
      const validImageUri = await validateImageUri(imageUrl)
      setImageUri(validImageUri)
    }

    fetchImageUri()
  }, [imageUri])

  return (
    <View className="border-b border-neutral-200 py-3 last:border-b-0">
      <ButtonPrimitive animationConfig={{ toValue: 0.99 }} onPress={() => onPressMove(id)}>
        <View className="flex-row">
          <View className="mr-3">
            <ImageVariant
              className="aspect-3/4 h-24 w-20 rounded-lg"
              source={imageUri as ImageURISource}
            />
            {onPressBookMark && (
              <View className="absolute left-1 top-1">
                <BookmarkButton
                  id={id}
                  size={24}
                  isBookMarked={isBookMarked}
                  onPress={() => onPressBookMark(id)}
                />
              </View>
            )}
          </View>
          <View className="mt-2 flex-1 justify-start">
            <Typo className="font-SemiBold text-base text-gray-800">{title}</Typo>
            {category && (
              <View className="mt-2 flex-row items-center">
                <SvgIcon name="category" size={14} />
                <Typo className="ml-1 text-sm text-gray-500">{category}</Typo>
              </View>
            )}
            {content && (
              <View className="mt-1 flex-row items-center">
                <SvgIcon name="explain" className="text-gray-400" size={14} />
                <Typo className="ml-1 text-sm text-gray-500" numberOfLines={1}>
                  {content}
                </Typo>
              </View>
            )}
            {address && (
              <View className="mt-1 flex-row items-center">
                <SvgIcon name="marker" className="text-gray-400" size={14} />
                <Typo className="ml-1 text-sm text-gray-500" numberOfLines={1}>
                  {address}
                </Typo>
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
