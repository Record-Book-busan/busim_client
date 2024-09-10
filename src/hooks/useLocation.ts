import { useState, useEffect } from 'react'
import Geolocation from 'react-native-geolocation-service'

import { useLocationPermission } from './useLocationPermission'

type Location = {
  lat: number
  lng: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({ lng: 126.570667, lat: 33.450701 })
  const { permissionStatus, requestLocationAccess } = useLocationPermission()

  const verifyLocation = (lng: number, lat: number) => {
    // 부산의 대략적인 좌표 범위
    const minLng = 128.7 // 부산 서쪽 경계
    const maxLng = 129.3 // 부산 동쪽 경계
    const minLat = 34.9 // 부산 남쪽 경계
    const maxLat = 35.4 // 부산 북쪽 경계

    if (lng < minLng || lng > maxLng) return false
    if (lat < minLat || lat > maxLat) return false

    return true
  }

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        if (verifyLocation(position.coords.longitude, position.coords.latitude)) {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        }
      },
      error => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  useEffect(() => {
    if (permissionStatus === 'granted') {
      getCurrentLocation()
    }
  }, [permissionStatus])

  const refreshLocation = async () => {
    const status = await requestLocationAccess()
    if (status === 'granted') {
      getCurrentLocation()
    }
  }

  return { location, refreshLocation }
}
