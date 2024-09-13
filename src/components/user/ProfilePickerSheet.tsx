import { View, Text } from 'react-native'

import { Button } from '@/shared'
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
      snapPoints={['25%']}
      showHandle={false}
      showCloseButton={true}
    >
      <View className="px-5 pb-2 pt-5">
        <Text className="mb-4 text-lg font-bold text-gray-900">사진 등록</Text>
        <View className="gap-y-2">
          <Button type="text" buttonStyle="flex-row items-center py-3" onPress={onSelectDefault}>
            <SvgIcon name="user" size={24} className="mr-4 text-gray-600" />
            <Text className="flex-1 text-base text-gray-800">기본 이미지로 변경하기</Text>
          </Button>
          <Button
            type="text"
            buttonStyle="rounded-lg flex-row items-center py-3"
            onPress={onSelectGallery}
          >
            <SvgIcon name="gallery" size={24} className="mr-4 text-gray-600" />
            <Text className="flex-1 text-base text-gray-800">앨범에서 선택하기</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}
