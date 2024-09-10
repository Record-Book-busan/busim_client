import { useEffect, useState, useCallback } from 'react'
import { Alert, Platform } from 'react-native'
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
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
      Alert.prompt('위치 권한이 차단되어 있습니다.') // TODO: 알럿모달 UI 띄우기
      await openSettings()
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
