import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  type PostRecord,
  PostRecordSchema,
  RecordDetailSchema,
  type UpdateRecord,
  UpdateRecordSchema,
  RecordListResponseSchema,
  RecordListResponse,
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

/** 기록을 가져오는 훅입니다. */
export const useRecordDetail = (id: number) => {
  return useSuspenseQuery({
    queryKey: ['recordDetail', id],
    queryFn: () => get_record_detail({ markId: id }),
  })
}

/** 나의 여행 기록 리스트를 가져오는 훅입니다. */
export const useInfiniteRecordList = () => {
  return useSuspenseInfiniteQuery<RecordListResponse>({
    queryKey: ['recordList'],
    queryFn: ({ pageParam = 0 }) => get_record_list({ page: pageParam as number, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined // 마지막 페이지면 undefined 반환
      return allPages.length // 다음 페이지 번호
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.first) return undefined // 첫 페이지면 undefined 반환
      return allPages.length - 2 // 이전 페이지 번호
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
  return await instance('kkilogbu/').post('record', { json: response }).json()
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

/**
 * 기록 상세 정보를 가져옵니다.
 * @param markId - 기록 식별자
 * @returns
 */
const get_record_detail = async (params: { markId: number }) => {
  const response = await instance('kkilogbu/').get(`record/${params.markId}`).json()
  return RecordDetailSchema.parse(response)
}

/**
 * 내 여행 기록을 가져옵니다.
 * @param page
 * @param size
 */
const get_record_list = async (params: { page: number; size: number }) => {
  const response = await instance('kkilogbu/')
    .get('user/record', {
      searchParams: {
        page: params.page,
        size: params.size,
      },
    })
    .json()
  return RecordListResponseSchema.parse(response)
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
const get_location_to_addr = async (params: getLocationToAddrProps): Promise<LocationToAddr> => {
  return await kakaoMap().get('geo/coord2address.json', { searchParams: params }).json()
}
