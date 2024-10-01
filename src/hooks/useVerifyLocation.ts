import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'

import { get_location_to_addr } from '@/services/record'

type Location = {
  lat: number
  lng: number
}

/**
 * 위치의 유효성을 확인하는 커스텀 훅
 * @param {Location} location - 확인할 위치 좌표
 * @returns {{
 *   isLocationValid: boolean,
 *   verifyLocation: () => Promise<boolean>
 * }}
 */
export const useVerifyLocation = (location: Location) => {
  const [isLocationValid, setIsLocationValid] = useState<boolean>(true)

  /**
   * 위치의 유효성을 확인하는 함수 (부산 지역 여부)
   * @returns {Promise<boolean>} 위치의 유효성 여부
   */
  const verifyLocation = useCallback(async (): Promise<boolean> => {
    try {
      const address = await get_location_to_addr({ x: location.lng, y: location.lat })
      const isValid = address?.documents[0]?.address.region_1depth_name.indexOf('부산') !== -1
      setIsLocationValid(isValid)

      if (!isValid) {
        Alert.alert('서비스 지역이 아닙니다', '부산 지역에서만 서비스가 제공됩니다.', [
          { text: '확인', style: 'default' },
        ])
      }

      return isValid
    } catch (error) {
      console.error('[ERROR] 위치 검증 실패:', error)
      setIsLocationValid(false)
      return false
    }
  }, [location])

  useEffect(() => {
    void verifyLocation()
  }, [location, verifyLocation])

  return {
    isLocationValid,
    verifyLocation,
  }
}
