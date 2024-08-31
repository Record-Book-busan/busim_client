import { Alert, Linking, Platform } from 'react-native'
import { launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'

const requestGalleryPermission = async (): Promise<boolean> => {
  const galleryPermission = Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android:
      parseInt(Platform.Version as string, 10) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  })

  if (!galleryPermission) {
    throw new Error('Unsupported platform')
  }

  const permissionStatus = await check(galleryPermission)
  if (permissionStatus === RESULTS.GRANTED || permissionStatus === RESULTS.LIMITED) {
    return true
  }

  const requestResult = await request(galleryPermission)
  if (requestResult === RESULTS.BLOCKED) {
    Alert.alert('사진첩 접근 권한이 차단되었습니다', '설정에서 권한을 허용해주세요', [
      { text: '취소', style: 'cancel' },
      { text: '설정으로 이동', onPress: () => Linking.openSettings() },
    ])
    return false
  }

  return requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED
}

export const useImagePicker = () => {
  const pickImage = async (options?: ImageLibraryOptions): Promise<Asset | null> => {
    const isPermissionGranted = await requestGalleryPermission()
    if (!isPermissionGranted) return null

    const galleryResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
      ...options,
    })

    if (galleryResponse.assets && galleryResponse.assets.length > 0) {
      return galleryResponse.assets[0]
    }

    return null
  }

  return {
    pickImage,
  }
}
