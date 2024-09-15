import { useSuspenseQuery } from '@tanstack/react-query'

import { PlaceDetailSchema } from '@/types/schemas/place'

import { instance } from './instance'

export type PlaceType = 'tourist' | 'restaurant'

/** 장소의 상세 정보를 가져오는 훅입니다. */
export const usePlaceDetail = (placeId: number, type: PlaceType) => {
  return useSuspenseQuery({
    queryKey: ['placeDetail', placeId, type],
    queryFn: () => get_place_detail({ placeId, type }),
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 카테고리에서 선택해서 나온 마커 중 한 곳을 선택 했을 때, 장소의 상세 정보를 가져옵니다.
 * @param type - 'tourist' | 'restaurant'
 * @param placeId - 장소 id
 */
export const get_place_detail = async (params: { type: PlaceType; placeId: number }) => {
  const response = await instance('kkilogbu/').get(`place/${params.type}/${params.placeId}`).json()

  // 응답 데이터를 로깅하여 실제 구조 확인
  console.log('API Response:', response)
  return PlaceDetailSchema.parse(response)
}
