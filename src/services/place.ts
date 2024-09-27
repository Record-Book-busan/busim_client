import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'

import {
  MapPlaceSchema,
  ParkingSchema,
  ToiletSchema,
  type PlaceDetail,
  PlaceDetailSchema,
} from '@/types/schemas/place'

import { instance } from './instance'

export type PlaceType = 'tourist' | 'restaurant'

type MapPlaceParams = {
  lat: number
  lng: number
  level: string
  isEnabled?: boolean
} & (
  | { restaurantCategories: string; touristCategories?: never }
  | { restaurantCategories?: never; touristCategories: string }
  | { restaurantCategories: string; touristCategories: string }
)

/**
 * 맛집, 관광 정보를 가져오는 훅입니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨 (LEVEL_1 ~ LEVEL_15)
 * @param restaurantCategories 음식점 카테고리 (NORMAL_RESTAURANT, SPECIAL_RESTAURANT)
 * @param touristCategories 관광지 카테고리 (TOURIST_SPOT, THEME, HOT_PLACE, NATURE, LEISURE_SPORTS)
 * @param isEnabled 쿼리 활성화
 */
export const useMapPlace = ({
  lat,
  lng,
  level,
  restaurantCategories,
  touristCategories,
  isEnabled,
}: MapPlaceParams) => {
  return useQuery({
    queryKey: ['mapPlace', lat, lng, level, restaurantCategories, touristCategories],
    queryFn: () =>
      get_map_place({
        lat,
        lng,
        level,
        restaurantCategories,
        touristCategories,
      }),
    enabled: isEnabled,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 장소의 상세 정보를 가져오는 훅입니다.
 * @param placeId 장소 ID
 * @param type 장소 타입 ('tourist' | 'restaurant')
 * @param isEnabled 쿼리 활성화
 */
export const usePlaceDetail = (placeId: number, type: PlaceType) => {
  return useSuspenseQuery({
    queryKey: ['placeDetail', placeId, type],
    queryFn: () => get_place_detail({ placeId, type }),
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 화장실 데이터를 가져오는 훅입니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨
 * @param isEnabled 쿼리 활성화
 */
export const useToilet = (lat: number, lng: number, level: string, isEnabled?: boolean) => {
  return useQuery({
    queryKey: ['toilet', lat, lng, level],
    queryFn: () => get_toilet({ lat, lng, level }),
    enabled: isEnabled,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 주차장 데이터를 가져오는 훅입니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨
 * @param isEnabled 쿼리 활성화
 */
export const useParking = (lat: number, lng: number, level: string, isEnabled?: boolean) => {
  return useQuery({
    queryKey: ['parking', lat, lng, level],
    queryFn: () => get_parking({ lat, lng, level }),
    enabled: isEnabled,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 맛집, 관광 정보를 가져옵니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨 (LEVEL_1 ~ LEVEL_15)
 * @param restaurantCategories 음식점 카테고리 (NORMAL_RESTAURANT, SPECIAL_RESTAURANT)
 * @param touristCategories 관광지 카테고리 (TOURIST_SPOT, THEME, HOT_PLACE, NATURE, LEISURE_SPORTS)
 */
const get_map_place = async (params: {
  lat: number
  lng: number
  level: string
  restaurantCategories?: string
  touristCategories?: string
}) => {
  const response = await instance('kkilogbu/').get('place', { searchParams: params }).json()
  return z.array(MapPlaceSchema).parse(response)
}

/**
 * 카테고리에서 선택해서 나온 마커 중 한 곳을 선택했을 때, 장소의 상세 정보를 가져옵니다.
 * @param type 장소 타입 ('tourist' | 'restaurant')
 * @param placeId 장소 ID
 */
const get_place_detail = async (params: {
  type: PlaceType
  placeId: number
}): Promise<PlaceDetail> => {
  return await instance('kkilogbu/').get(`place/${params.type}/${params.placeId}`).json()
}

/**
 * 화장실 데이터를 가져옵니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨
 */
const get_toilet = async (params: { lat: number; lng: number; level: string }) => {
  const response = await instance('api/').get('toiletData', { searchParams: params }).json()
  return z.array(ToiletSchema).parse(response)
}

/**
 * 주차장 데이터를 가져옵니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨
 */
const get_parking = async (params: { lat: number; lng: number; level: string }) => {
  const response = await instance('api/').get('parking', { searchParams: params }).json()
  return z.array(ParkingSchema).parse(response)
}

/**
 * 바텀 시트를 위한 특별한 맛집 정보를 가져오는 훅입니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨 (LEVEL_1 ~ LEVEL_15)
 * @param restaurantCategories 음식점 카테고리 (NORMAL_RESTAURANT, SPECIAL_RESTAURANT)
 * @param touristCategories 관광지 카테고리 (TOURIST_SPOT, THEME, HOT_PLACE, NATURE, LEISURE_SPORTS)
 * @param isEnabled 쿼리 활성화
 */
export const useSpecialPlace = ({
  lat,
  lng,
  level,
  restaurantCategories,
  touristCategories,
  isEnabled,
}: MapPlaceParams) => {
  return useQuery({
    queryKey: ['mapPlace', lat, lng, level, restaurantCategories, touristCategories],
    queryFn: () =>
      get_spcial_place({
        lat,
        lng,
        level,
        restaurantCategories,
        touristCategories,
      }),
    enabled: isEnabled,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * 바텀 시트를 위한 특별한 맛집 정보를 가져옵니다.
 * @param lat 위도
 * @param lng 경도
 * @param level 줌 레벨 (LEVEL_1 ~ LEVEL_15)
 * @param restaurantCategories 음식점 카테고리 (NORMAL_RESTAURANT, SPECIAL_RESTAURANT)
 * @param touristCategories 관광지 카테고리 (TOURIST_SPOT, THEME, HOT_PLACE, NATURE, LEISURE_SPORTS)
 */
const get_spcial_place = async (params: {
  lat: number
  lng: number
  level: string
  restaurantCategories?: string
  touristCategories?: string
}) => {
  const response = await instance('kkilogbu/').get('place', { searchParams: params }).json()
  const places = z.array(MapPlaceSchema).parse(response)

  const placeDetails = Promise.all(
    places.splice(0, 41).map(async place => {
      return await instance('kkilogbu/').get(`place/${place.type}/${place.id}`).json()
    }),
  )

  return z.array(PlaceDetailSchema).parse(placeDetails)
}
