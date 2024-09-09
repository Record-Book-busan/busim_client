import { z } from 'zod'

export const RecordListSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  title: z.string(),
  content: z.string(),
  cat2: z.string(),
  lat: z.number(),
  lng: z.number(),
})

export type RecordList = z.infer<typeof RecordListSchema>

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
