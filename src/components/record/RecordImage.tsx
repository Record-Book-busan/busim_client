import { forwardRef } from 'react'
import { View } from 'react-native'

import { ImageUploader } from '@/components/record'

import type { ImageAsset } from '@/services/image'

interface RecordImageProps {
  uri?: string
  onImageSelected: (image: ImageAsset | null) => void
}

export const RecordImage = forwardRef<View, RecordImageProps>(({ uri, onImageSelected }, ref) => {
  return (
    <View ref={ref}>
      <ImageUploader uri={uri} onImageSelected={onImageSelected} />
    </View>
  )
})

RecordImage.displayName = 'RecordImage'
