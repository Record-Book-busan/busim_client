import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native'
import {
  launchCamera,
  type ImagePickerResponse,
  type CameraOptions,
} from 'react-native-image-picker'

// 카메라 권한 요청 (사진 저장 시 android만 권한 확인)
const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('카메라 권한이 필요합니다', '설정에서 카메라 권한을 허용해주세요', [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ])
        return false
      }
      return true
    } catch (err) {
      console.warn(err)
      return false
    }
  }
  return true
}

export function useCamera() {
  // 카메라 사진 촬영
  const takePhoto = async (options?: CameraOptions) => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      console.log('카메라 권한이 거부되었습니다')
      return
    }

    const response = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
      ...options,
    })
    return handleImagePickerResponse(response)
  }

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('카메라를 취소했습니다')
    } else if (response.errorCode) {
      console.log('카메라에서 오류가 발생했습니다: ', response.errorCode, response.errorMessage)
    } else if (response.assets && response.assets.length > 0) {
      return response.assets[0]
    }
  }

  return {
    takePhoto,
  }
}
