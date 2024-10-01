import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'

import {
  type PostRecord,
  PostRecordSchema,
  RecordDetailSchema,
  type UpdateRecord,
  UpdateRecordSchema,
  MapRecordSchema,
  RecordDetail,
  RecordListArraySchema,
  RecordDetailArraySchema,
  // RecordSchma,
} from '@/types/schemas/record'

import { instance, kakaoMap } from './instance'

/** 새로운 기록을 생성하는 훅입니다. */
export const useCreateRecord = () => {
  const { mutate } = useMutation({
    mutationFn: post_record,
  })
  return { mutateRecord: mutate }
}

/** 기존 기록을 수정하는 훅입니다. */
export const useUpdateRecord = () => {
  const { mutate } = useMutation({
    mutationFn: patch_record,
  })
  return { mutateRecord: mutate }
}

/** 상세한 기록을 가져오는 훅입니다. */
export const useRecordDetail = (id: number) => {
  return useSuspenseQuery({
    queryKey: ['recordDetail', id],
    queryFn: () => get_record_image_detail({ markId: id }),
  })
}

/** 지도기반의 기록을 가져오는 훅입니다. */
export const useMapRecord = (param: { lat: number; lng: number; level: string }) => {
  const { lat, lng, level } = param
  return useQuery({
    queryKey: ['mapRecord', lat, lng, level],
    queryFn: () => get_map_record({ lat, lng, level }),
    retryOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: prev => prev,
  })
}

/** 나의 여행 기록 리스트를 가져오는 훅입니다. */
export const useInfiniteRecordList = () => {
  return useSuspenseInfiniteQuery<RecordDetail[]>({
    queryKey: ['recordList'],
    queryFn: ({ pageParam = 0 }) =>
      get_record_list({ query: '', offset: pageParam as number, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length * 10
    },
    initialPageParam: 0,
  })
}

/** 위치 정보를 주소로 변환하는 훅입니다. */
export const useLocationToAddr = (lat: number, lng: number) => {
  return useQuery({
    queryKey: ['locationToAddr', lat, lng],
    queryFn: () => get_location_to_addr({ x: lng, y: lat }),
    enabled: !!lat && !!lng,
  })
}

/**
 * 새로운 기록을 생성합니다.
 * @param lat - 위도
 * @param lng - 경도
 * @param title - 제목
 * @param content - 내용
 * @param imageUrl - 이미지 URL
 * @returns
 */
export const post_record = async (params: PostRecord) => {
  const response = PostRecordSchema.parse(params)
  return await instance('kkilogbu/').post('record/auth', { json: response }).json()
}

/**
 * 기존 기록을 수정합니다.
 */
export const patch_record = async (params: UpdateRecord) => {
  const { markId, ...response } = UpdateRecordSchema.parse(params)
  return await instance('kkilogbu/')
    .post(`record/${params.markId}`, {
      json: response,
    })
    .json()
}

// /**
//  * 기록 상세 정보를 가져옵니다.
//  * @param markId - 기록 식별자
//  * @returns
//  */
// const get_record_detail = async (params: { markId: number }) => {
//   const response = await instance('kkilogbu/').get(`record/${params.markId}`).json()
//   return RecordSchma.parse(response)
// }

/**
 * 기록 이미지 상세 정보를 가져옵니다.
 * @param markId - 기록 식별자
 * @returns
 */
const get_record_image_detail = async (params: { markId: number }) => {
  const response = await instance('kkilogbu/').get(`record/images/${params.markId}`).json()
  return RecordDetailSchema.parse(response)
}

/**
 * 지도 기반의 기록을 가져옵니다.
 * @param lat - 위도
 * @param lng - 경도
 * @level level - 줌 레벨
 */
const get_map_record = async (params: { lat: number; lng: number; level: string }) => {
  const response = await instance('kkilogbu/').get('record', { searchParams: params }).json()
  return z.array(MapRecordSchema).parse(response)
}

/**
 * 내 여행 기록을 가져옵니다.
 * @param page
 * @param size
 */
const get_record_list = async (params: { query: string; offset: number; limit: number }) => {
  console.log(params.offset)

  const response = await instance('kkilogbu/')
    .get('record/images', {
      searchParams: params,
    })
    .json()
  const parsedResponses = RecordListArraySchema.parse(response)

  console.log(`parsedReponse: ${JSON.stringify(parsedResponses)}`)

  const details = await Promise.all(
    parsedResponses
      .filter(parsedResponse => parsedResponse.id !== 0)
      .map(async parsedResponse => get_record_image_detail({ markId: parsedResponse.id })),
  )

  console.log(`details: ${JSON.stringify(details)}`)

  return RecordDetailArraySchema.parse(details)
}

type RoadAddress = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  road_name: string
  underground_yn: string
  main_building_no: string
  sub_building_no: string
  building_name: string
  zone_no: string
}

type Address = {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  mountain_yn: string
  main_address_no: string
  sub_address_no: string
  zip_code: string
}

type Document = {
  road_address: RoadAddress
  address: Address
}

export type LocationToAddr = {
  meta: {
    total_count: number
  }
  documents: Document[]
}

type getLocationToAddrProps = {
  x: number
  y: number
  input_coord?: string
}

/**
 * 위치 정보를 주소로 변환합니다.
 * @param x - lng 경도
 * @param y - lat 위도
 */
export const get_location_to_addr = async (
  params: getLocationToAddrProps,
): Promise<LocationToAddr> => {
  return await kakaoMap().get('geo/coord2address.json', { searchParams: params }).json()
}

/**
 * 기록을 북마크하는 훅입니다.
 */
export const usePostRecordBookMark = () => {
  const { mutateAsync } = useMutation({
    mutationFn: post_record_bookmark,
  })

  return mutateAsync
}

/**
 * 기록을 북마크합니다.
 */
const post_record_bookmark = async (id: number): Promise<string> => {
  return await instance('kkilogbu/').post(`record/auth/${id}/bookmark`).text()
}

/**
 * 기록 북마크를 삭제하는 훅입니다.
 */
export const useDeleteRecordBookMark = () => {
  const { mutateAsync } = useMutation({
    mutationFn: delete_record_bookmark,
  })

  return mutateAsync
}

/**
 * 기록 북마크를 삭제합니다.
 */
const delete_record_bookmark = async (id: number): Promise<string> => {
  return await instance('kkilogbu/').delete(`record/auth/${id}/bookmark`).text()
}
