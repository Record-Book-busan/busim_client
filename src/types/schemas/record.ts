import { z } from 'zod'

export const PostRecordSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(501),
  imageUrl: z.string(),
})
export type PostRecord = z.infer<typeof PostRecordSchema>

export const UpdateRecordSchema = z.object({
  markId: z.number(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(501),
  imageUrl: z.string(),
})
export type UpdateRecord = z.infer<typeof UpdateRecordSchema>

export const RecordDetailSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  imageUrl: z.string().url(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  createdAt: z.string().datetime(),
})
export type RecordDetail = z.infer<typeof RecordDetailSchema>

export const RecordListSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  title: z.string(),
  content: z.string(),
  lat: z.number(),
  lng: z.number(),
})
export type RecordList = z.infer<typeof RecordListSchema>

const PageableSchema = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  sort: z.object({
    empty: z.boolean(),
    sorted: z.boolean(),
    unsorted: z.boolean(),
  }),
  offset: z.number(),
  paged: z.boolean(),
  unpaged: z.boolean(),
})

export const RecordListResponseSchema = z.object({
  content: z.array(RecordListSchema),
  pageable: PageableSchema,
  first: z.boolean(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.object({
    empty: z.boolean(),
    sorted: z.boolean(),
    unsorted: z.boolean(),
  }),
  numberOfElements: z.number(),
  empty: z.boolean(),
})

export type RecordListResponse = z.infer<typeof RecordListResponseSchema>
