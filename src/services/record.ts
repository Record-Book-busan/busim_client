import { useMutation } from '@tanstack/react-query'

import { PostRecordSchema, type RecordList, type PostRecord } from '@/types/schemas/record'

import { instance } from './instance'

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
  const data = PostRecordSchema.parse(params)
  return await instance('kkilogbu/').post('record', { json: data }).json()
}

/** 새로운 기록을 생성하는 훅입니다. */
export const useCreateRecord = () => {
  const { mutate } = useMutation({
    mutationFn: post_record,
  })
  return { mutateRecord: mutate }
}

export interface RecordListResponse {
  content: RecordList[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  first: boolean
  last: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  empty: boolean
}
