import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { useLocationPermission } from './useLocationPermission'

type Location = {
  lat: number
  lng: number
}

/**
 * 위치 정보를 관리하는 커스텀 훅
 * @returns {{
 *   location: Location,
 *   refreshLocation: () => Promise<Location | null>
 * }}
 */
export const useLocation = () => {
  const [location, setLocation] = useState<Location>({ lat: 35.1626, lng: 129.16 }) // 기본 위치 (부산)
  const { permissionStatus, requestLocationAccess } = useLocationPermission()

  /**
   * 현재 위치를 가져오는 함수
   * @returns {Promise<Location | null>} 위치 정보 또는 null
   */
  const getCurrentLocation = useCallback((): Promise<Location | null> => {
    return new Promise<Location | null>(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          resolve(coords)
        },
        error => {
          console.error('[ERROR] 현재 위치 가져오기 실패:', error)
          Alert.alert('위치 정보 오류', '현재 위치를 가져올 수 없습니다.', [
            { text: '확인', style: 'default' },
          ])
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    })
  }, [])

  /**
   * 위치를 갱신하는 함수
   * @returns {Promise<Location | null>} 갱신된 위치 정보 또는 null
   */
  const refreshLocation = useCallback(async (): Promise<Location | null> => {
    try {
      const status = await requestLocationAccess()
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '앱에서 위치 정보를 사용하려면 권한이 필요합니다.', [
          { text: '확인', style: 'default' },
        ])
        return null
      }

      const coords = await getCurrentLocation()
      if (coords) {
        setLocation(coords)
        return coords
      }
      return null
    } catch (error) {
      console.error('[ERROR] 위치 갱신 실패:', error)
      return null
    }
  }, [requestLocationAccess])

  useEffect(() => {
    if (permissionStatus === 'granted') {
      void refreshLocation()
    }
  }, [permissionStatus])

  return {
    location,
    refreshLocation,
  }
}
