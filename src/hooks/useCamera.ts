import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { useState, useRef } from 'react'
import { Platform, Alert, Linking, PermissionsAndroid } from 'react-native'
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from 'react-native-vision-camera'

export const useCamera = () => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back')
  const [photo, setPhoto] = useState<PhotoFile | null>(null)
  const device = useCameraDevice(cameraPosition)
  const { hasPermission, requestPermission } = useCameraPermission()
  const cameraRef = useRef<Camera>(null)

  // 카메라 권한 체크 및 요청
  const checkCameraPermission = async () => {
    if (!hasPermission) {
      const granted = await requestPermission()
      if (!granted) {
        Alert.alert('카메라 권한이 필요합니다', '설정에서 카메라 권한을 허용해주세요', [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ])
      }
      return granted
    }
    return true
  }

  // 갤러리 저장 권한 체크
  const checkGalleryPermission = async () => {
    const granted = await requestSavePermission()
    if (!granted) {
      Alert.alert('갤러리 저장 권한이 필요합니다', '설정에서 갤러리 저장 권한을 허용해주세요', [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
      ])
    }
    return granted
  }

  // 갤러리 저장 권한 요청
  const requestSavePermission = async () => {
    if (Platform.OS !== 'android') return true

    if (Platform.Version >= 33) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]
      const statuses = await PermissionsAndroid.requestMultiple(permissions)
      return (
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
      )
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      )
      return status === PermissionsAndroid.RESULTS.GRANTED
    }
  }

  const changeCameraPosition = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))
  }

  // 사진 찍기
  const takePhoto = async () => {
    if (cameraRef.current == null) return
    const photo = await cameraRef.current.takePhoto({
      enableAutoRedEyeReduction: false,
    })
    setPhoto(photo)
    return photo
  }

  // 사진 저장
  const savePhoto = async () => {
    if (photo == null) return
    try {
      const hasPermission = await checkGalleryPermission()
      if (!hasPermission) return false

      await CameraRoll.saveAsset(`file://${photo.path}`, { type: 'photo' })
      console.log('사진이 저장되었습니다')
    } catch (error) {
      console.error('사진 저장 실패:', error)
    }
  }

  // 카메라 초기화
  const resetCamera = () => {
    setPhoto(null)
  }

  return {
    device,
    hasPermission,
    changeCameraPosition,
    takePhoto,
    savePhoto,
    photo,
    resetCamera,
    checkCameraPermission,
    cameraRef,
  }
}
