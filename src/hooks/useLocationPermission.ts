import { useEffect, useState, useCallback } from 'react'
import { Alert, Linking, Platform } from 'react-native'
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions'

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})

export const useLocationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null)

  const checkPermission = async () => {
    if (!LOCATION_PERMISSION) return null

    const result = await check(LOCATION_PERMISSION)
    setPermissionStatus(result)

    return result
  }

  const requestPermission = async () => {
    if (!LOCATION_PERMISSION) return null

    const result = await request(LOCATION_PERMISSION)
    setPermissionStatus(result)

    return result
  }

  const requestLocationAccess = useCallback(async () => {
    const status = await checkPermission()

    if (status === RESULTS.DENIED) {
      return await requestPermission()
    } else if (status === RESULTS.BLOCKED) {
      let msg: string = ''

      if (Platform.OS === 'android') {
        msg = '기기의 "설정 > 위치 > 앱 권한"에서 위치서비스를 켜주세요.'
      } else {
        msg = '기기의 "설정 > 개인정보 보호"에서 위치서비스를 켜주세요.'
      }

      Alert.alert('위치 서비스를 사용할 수 없습니다.', msg, [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
      ]) // TODO: 알럿모달 UI 띄우기
    }

    return status
  }, [checkPermission, requestPermission])

  useEffect(() => {
    void checkPermission()
  }, [checkPermission])

  return {
    permissionStatus,
    requestLocationAccess,
    checkPermission,
  }
}
