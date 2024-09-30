import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { get_location_to_addr } from '@/services/record'

import { useLocationPermission } from './useLocationPermission'

type Location = {
  lat: number
  lng: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({ lat: 35.1626, lng: 129.16 }) // 기본 위치 (부산)
  const [isLocationValid, setIsLocationValid] = useState<boolean>(true)
  const { permissionStatus, requestLocationAccess } = useLocationPermission()

  // 위치 권한 요청 및 현재 위치 가져오기
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
        const isValid = await verifyLocation(coords)
        if (!isValid) {
          Alert.alert('서비스 지역이 아닙니다', '부산 지역에서만 서비스가 제공됩니다.', [
            { text: '확인', style: 'default' },
          ])
          return null
        }
        setLocation(coords)
        return coords
      }
      return null
    } catch (error) {
      console.error('[ERROR] 위치 갱신 실패:', error)
      return null
    }
  }, [requestLocationAccess])

  // 현재 위치 가져오기
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

  // 위치 유효성 확인 (부산 지역 여부)
  const verifyLocation = useCallback(async (coords: Location): Promise<boolean> => {
    try {
      const address = await get_location_to_addr({ x: coords.lng, y: coords.lat })
      const isValid = address?.documents[0]?.address.region_1depth_name.indexOf('부산') !== -1
      setIsLocationValid(isValid)
      return isValid
    } catch (error) {
      console.error('[ERROR] 위치 검증 실패:', error)
      setIsLocationValid(false)
      return false
    }
  }, [])

  // 컴포넌트 마운트 시 위치 권한 확인 및 위치 가져오기
  useEffect(() => {
    if (permissionStatus === 'granted') {
      void refreshLocation()
    }
  }, [permissionStatus])

  return {
    location,
    isLocationValid,
    refreshLocation,
  }
}
