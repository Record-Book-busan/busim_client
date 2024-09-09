import { z } from 'zod'

export const PlaceSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(), // 일부 데이터에 빈 문자열로 와서 optional로 처리
  category: z.string(),
})

export type Place = z.infer<typeof PlaceSchema>

export const PlaceArraySchema = z.array(PlaceSchema)
