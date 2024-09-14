import { View } from 'react-native'

import { ImageUploader } from '@/components/record'

import type { ImageAsset } from '@/services/image'

interface RecordImageProps {
  uri?: string
  onImageSelected: (image: ImageAsset | null) => void
  inputRef: React.RefObject<View>
}

export const RecordImage = ({ uri, onImageSelected, inputRef }: RecordImageProps) => {
  return (
    <View ref={inputRef} className="px-3">
      <ImageUploader uri={uri} onImageSelected={onImageSelected} />
    </View>
  )
}
