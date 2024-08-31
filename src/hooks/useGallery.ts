import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native'
import { launchImageLibrary, type ImageLibraryOptions } from 'react-native-image-picker'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'

type PermissionType = 'read' | 'save'

const getPermission = (type: PermissionType) => {
  if (type === 'read') {
    return Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android:
        parseInt(Platform.Version as string, 10) >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    })
  } else {
    return Platform.OS === 'android'
      ? Platform.Version >= 33
        ? [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO]
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : null
  }
}

const checkPermission = async (type: PermissionType): Promise<boolean> => {
  const permission = getPermission(type)

  if (!permission) return true

  if (Array.isArray(permission)) {
    const statuses = await Promise.all(permission.map(p => check(p)))
    return statuses.every(status => status === RESULTS.GRANTED)
  }

  const status = await check(permission)
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED
}

const requestPermission = async (type: PermissionType): Promise<boolean> => {
  const permission = getPermission(type)

  if (!permission) return true // ios는 저장 권한이 필요없음

  if (Array.isArray(permission)) {
    const statuses = await PermissionsAndroid.requestMultiple(permission)
    return Object.values(statuses).every(status => status === PermissionsAndroid.RESULTS.GRANTED)
  }

  const status = await request(permission)
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED
}

const showPermissionAlert = (type: PermissionType) => {
  const message = type === 'read' ? '사진첩 접근' : '갤러리 저장'
  Alert.alert(`${message} 권한이 필요합니다`, `설정에서 ${message} 권한을 허용해주세요`, [
    { text: '취소', style: 'cancel' },
    { text: '설정으로 이동', onPress: () => Linking.openSettings() },
  ])
}

export const useGalleryPermissions = () => {
  const checkAndRequestPermission = async (type: PermissionType): Promise<boolean> => {
    const hasPermission = await checkPermission(type)
    if (hasPermission) return true

    const granted = await requestPermission(type)
    if (!granted) {
      showPermissionAlert(type)
    }
    return granted
  }

  return {
    checkAndRequestReadPermission: () => checkAndRequestPermission('read'),
    checkAndRequestSavePermission: () => checkAndRequestPermission('save'),
  }
}

export function useGallery() {
  const { checkAndRequestReadPermission, checkAndRequestSavePermission } = useGalleryPermissions()

  const getPhoto = async (options?: ImageLibraryOptions) => {
    const hasPermission = await checkAndRequestReadPermission()
    if (!hasPermission) {
      console.log('사진첩 접근 권한이 거부되었습니다')
      return
    }

    const response = await launchImageLibrary({
      mediaType: 'photo',
      ...options,
    })

    if (response.didCancel) {
      console.log('사진첩 접근을 취소했습니다')
    } else if (response.errorCode) {
      console.log('사진첩에서 오류가 발생했습니다: ', response.errorCode, response.errorMessage)
    } else if (response.assets && response.assets.length > 0) {
      return response.assets[0]
    }
  }

  const savePhoto = async (uri: string) => {
    const hasPermission = await checkAndRequestSavePermission()
    if (!hasPermission) {
      console.log('사진첩 저장 권한이 거부되었습니다')
      return
    }

    try {
      await CameraRoll.saveAsset(uri, { type: 'photo' })
      console.log('사진 저장 성공!')
    } catch (error) {
      console.error('사진 저장 실패:', error)
    }
  }

  return {
    getPhoto,
    savePhoto,
  }
}
