import { useLocation } from '@/hooks/useLocation'
import { useLocationToAddr } from '@/services/record'
import { formatAddress } from '@/utils/format'

/** 현재 위치 주소로 변환하는 훅입니다. */
export const useCurrentLocationToAddr = () => {
  const { location, refreshLocation } = useLocation()
  const { isLoading, isError, refetch } = useLocationToAddr(location.lat, location.lng)

  const getCurrentAddress = async () => {
    await refreshLocation()
    const { data } = await refetch()

    if (data) {
      const address = formatAddress(data)
      return {
        name: address.fullAddress,
        lat: location.lat,
        lng: location.lng,
      }
    }

    throw new Error('[ERROR]: 주소를 가져오는데 실패했습니다.')
  }

  return { getCurrentAddress, isLoading, isError }
}
