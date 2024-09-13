import { useState } from 'react'
import { View, Image, Text } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

import { ImagePickerSheet } from '@/components/record'
import { window } from '@/constants'
import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { SvgIcon } from '@/shared'
import { ButtonPrimitive } from '@/shared/Button'

import type { ImageAsset } from '@/services/image'

interface ImageUploaderProps {
  uri?: string
  onImageSelected: (image: ImageAsset | null) => void
}

export function ImageUploader({ uri, onImageSelected }: ImageUploaderProps) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const { takePhoto } = useCamera()
  const { getPhoto } = useGallery()

  const handleTakePhoto = async () => {
    const photo = await takePhoto()
    if (photo && photo.uri) {
      onImageSelected({
        uri: photo.uri,
        type: photo.type,
        fileName: photo.fileName,
      })
      setIsImagePickerOpen(false)
    }
  }

  const handleGetPhoto = async () => {
    const photo = await getPhoto()
    if (photo && photo.uri) {
      onImageSelected({
        uri: photo.uri,
        type: photo.type,
        fileName: photo.fileName,
      })
      setIsImagePickerOpen(false)
    }
  }

  return (
    <View className="relative mb-4 items-center justify-center overflow-hidden rounded-xl border border-gray-300">
      {uri ? (
        <View className="w-full">
          <Lightbox
            activeProps={{
              style: {
                width: window.width,
                height: window.width,
              },
              resizeMode: 'contain',
            }}
          >
            <Image source={{ uri: uri }} className="h-48 w-full" resizeMode="cover" />
          </Lightbox>
          <View className="absolute right-3 top-2">
            <ButtonPrimitive onPress={() => onImageSelected(null)}>
              <SvgIcon name="trash" size={24} className="text-BUSIM-blue" />
            </ButtonPrimitive>
          </View>
        </View>
      ) : (
        <View className="h-48 w-full items-center justify-center rounded-xl">
          <ButtonPrimitive onPress={() => setIsImagePickerOpen(true)}>
            <SvgIcon name="add" className="text-BUSIM-blue" />
          </ButtonPrimitive>
          <Text className="mt-2 text-sm text-gray-800">사진 추가하기</Text>
        </View>
      )}
      {/* 이미지 선택 바텀 시트 */}
      <ImagePickerSheet
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectGallery={handleGetPhoto}
        onSelectCamera={handleTakePhoto}
      />
    </View>
  )
}
