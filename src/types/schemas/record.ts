import { z } from 'zod'

export const PostRecordSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(501),
  imageUrl: z.string(),
  address: z.string(),
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

export const RecordSchma = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  id: z.number(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(501),
  imageUrl: z.string(),
  createdAt: z.string(),
})
export type Record = z.infer<typeof RecordSchma>

export const RecordDetailSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(100),
  thumbnailUrl: z.string().url().nullable(),
  address: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  touristCategory: z.string(),
  content: z.string().optional(),
})
export type RecordDetail = z.infer<typeof RecordDetailSchema>
export const RecordDetailArraySchema = z.array(RecordDetailSchema)

export const RecordListSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(100),
  thumbnailUrl: z.string().url().nullable(),
  address: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  touristCategory: z.string(),
  content: z.string().optional(),
})
export type RecordList = z.infer<typeof RecordListSchema>

export const RecordListResponseSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
})

export type RecordListResponse = z.infer<typeof RecordListResponseSchema>
export const RecordListArraySchema = z.array(RecordListResponseSchema)

export const MapRecordSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  lat: z.number(),
  lng: z.number(),
})
export type MapPlace = z.infer<typeof MapRecordSchema>

export const FeedSchema = z.object({
  id: z.number(),
  imageUrl: z.string().url().or(z.literal('')),
})
export type FeedType = z.infer<typeof FeedSchema>
export const FeedArraySchema = z.array(FeedSchema)
