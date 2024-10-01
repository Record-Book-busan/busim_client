import { FileSystem } from 'react-native-file-access'

import { get_location_to_addr } from '@/services/record'

export const checkFileSize = async (uri: string): Promise<boolean> => {
  const fileInfo = await FileSystem.stat(uri)
  const fileSizeInMB = fileInfo.size / (1024 * 1024)
  console.log('파일 사이즈 (MB):', fileSizeInMB.toFixed(1))
  return fileSizeInMB <= 15
}

type Location = {
  lat: number
  lng: number
}

/**
 * 위치의 유효성을 확인하는 함수 (부산 지역 여부)
 * @param location
 * @returns {Promise<boolean>} 위치의 유효성 여부
 */
export const verifyLocation = async (location: Location): Promise<boolean> => {
  try {
    if (!location) throw new Error('위치가 설정되지 않음!')

    const address = await get_location_to_addr({ x: location.lng, y: location.lat })

    // documents 배열이 비어있거나, 필요한 데이터가 없는 경우를 체크
    if (!address?.documents || address.documents.length === 0) {
      return false
    }

    const region = address.documents[0]?.address?.region_1depth_name

    const isValid = region === '부산' || region === '부산광역시'

    return isValid
  } catch (error) {
    console.error('[ERROR] 위치 검증 실패:', error)
    return false
  }
}
