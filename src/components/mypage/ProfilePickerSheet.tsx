import { View, Text, TouchableOpacity } from 'react-native'

import { SvgIcon } from '@/shared/SvgIcon'

import { BottomSheet } from '../common'

interface ProfilePickerSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelectGallery: () => void
  onSelectDefault: () => void
}

export const ProfilePickerSheet = ({
  isOpen,
  onClose,
  onSelectGallery,
  onSelectDefault,
}: ProfilePickerSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={['26%']}
      showHandle={false}
      showCloseButton={true}
    >
      <View className="px-6 pb-3 pt-5">
        <Text className="mb-4 text-lg font-semibold text-gray-900">여행 사진 업로드</Text>
        <TouchableOpacity
          onPress={onSelectGallery}
          className="flex-row items-center border-b border-neutral-100 py-3"
        >
          <SvgIcon name="gallery" size={24} className="mr-4 text-gray-600" />
          <Text className="text-base text-gray-800">앨범에서 사진 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSelectDefault} className="flex-row items-center py-3">
          <SvgIcon name="camera" size={24} className="mr-4 text-gray-600" />
          <Text className="text-base text-gray-800">기본 이미지로 변경</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  )
}
