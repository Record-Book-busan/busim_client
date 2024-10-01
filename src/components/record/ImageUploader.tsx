import { useState } from 'react'
import { View, Image, Pressable } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

import { ImagePickerSheet } from '@/components/record'
import { window } from '@/constants'
import { useCamera } from '@/hooks/useCamera'
import { useGallery } from '@/hooks/useGallery'
import { SvgIcon, Typo } from '@/shared'
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
    <Pressable
      className="h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100"
      onPress={() => setIsImagePickerOpen(true)}
    >
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
            <Image source={{ uri: uri }} className="h-full w-full" resizeMode="cover" />
          </Lightbox>
          <View className="absolute right-3 top-2">
            <ButtonPrimitive onPress={() => onImageSelected(null)}>
              <SvgIcon name="xCircleFilled" size={22} className="text-neutral-700" />
            </ButtonPrimitive>
          </View>
        </View>
      ) : (
        <View className="items-center">
          <SvgIcon name="camera" size={40} className="text-gray-400" />
          <Typo className="mt-2 font-SemiBold text-lg text-gray-600">사진을 추가해주세요</Typo>
        </View>
      )}
      {/* 이미지 선택 바텀 시트 */}
      <ImagePickerSheet
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectGallery={handleGetPhoto}
        onSelectCamera={handleTakePhoto}
      />
    </Pressable>
  )
}
