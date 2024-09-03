import {
  Platform,
  ActionSheetIOS,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native'

import SafeScreen from '../../components/common/SafeScreen'
import { SvgIcon } from '../SvgIcon'

interface ImagePickerModalProps {
  isVisible: boolean
  onClose: () => void
  onGalleryPress: () => void
  onCameraPress: () => void
}

// TODO: 모달 디자인 변경 필요
function ImagePickerModal({
  isVisible,
  onClose,
  onGalleryPress,
  onCameraPress,
}: ImagePickerModalProps) {
  if (Platform.OS === 'ios') {
    if (!isVisible) return

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Gallery', 'Camera'],
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          onGalleryPress()
        } else if (buttonIndex === 2) {
          onCameraPress()
        } else {
          onClose()
        }
      },
    )
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeScreen>
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={onClose}
        >
          <View
            className="rounded-t-3xl bg-white p-6"
            onStartShouldSetResponder={() => true}
            onResponderRelease={e => e.stopPropagation()}
          >
            <Text className="mb-6 text-center text-lg font-semibold">Choose Image Source</Text>
            <TouchableOpacity
              onPress={onGalleryPress}
              className="mb-4 flex-row items-center rounded-xl bg-gray-100 p-4"
            >
              <SvgIcon size={24} name="camera" />
              <Text className="text-base text-gray-800">Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCameraPress}
              className="mb-4 flex-row items-center rounded-xl bg-gray-100 p-4"
            >
              <SvgIcon size={24} name="recommend" />
              <Text className="text-base text-gray-800">Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-200 p-4">
              <Text className="text-center text-base text-gray-800">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </SafeScreen>
    </Modal>
  )
}

export default ImagePickerModal
