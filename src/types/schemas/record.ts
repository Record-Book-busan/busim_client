import { z } from 'zod'

export const PostRecordSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  imageUrl: z.string(),
})

export type PostRecord = z.infer<typeof PostRecordSchema>

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
