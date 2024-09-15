import { z } from 'zod'

export const PlaceSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().optional(),
  category: z.string(),
})

export type Place = z.infer<typeof PlaceSchema>
export const PlaceArraySchema = z.array(PlaceSchema)

export const PlaceDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imageUrl2: z.string(),
  address: z.string(),
  addressDetail: z.string().nullable(),
  zipcode: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  cat1: z.string(),
  cat2: z.string(),
  operatingTime: z.string().nullable(),
  phone: z.string().nullable(),
})
export type PlaceDetail = z.infer<typeof PlaceDetailSchema>
