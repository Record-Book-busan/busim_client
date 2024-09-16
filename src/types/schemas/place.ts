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
  title: z.string().optional(),
  content: z.string().nullable().optional(),
  imageUrl: z
    .union([
      z.array(z.string().nullable()),
      z.array(z.string()), // 정상적인 URL 배열
    ])
    .optional(),
  imageUrl2: z.string().nullable().optional(),
  address: z.string(),
  addressDetail: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
  cat1: z.string(),
  cat2: z.union([z.string(), z.array(z.string())]).optional(),
  restaurantCat2: z.array(z.string()).optional(),
  touristCat2: z.string().optional(),
  operatingTime: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  report: z.string().nullable().optional(),
})

export type PlaceDetail = z.infer<typeof PlaceDetailSchema>

export const MapPlaceSchema = z.object({
  id: z.number(),
  lat: z.number(),
  lng: z.number(),
  imageUrl: z.string(),
  category: z.string(),
  type: z.string(),
})
export type MapPlace = z.infer<typeof MapPlaceSchema>

export const ToiletSchema = z.object({
  toiletName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phoneNumber: z.string(),
  openingHours: z.string(),
})
export type Toilet = z.infer<typeof ToiletSchema>

export const ParkingSchema = z.object({
  id: z.number(),
  lat: z.number(),
  lng: z.number(),
  jibunAddr: z.string(),
  pkFm: z.string(),
  pkCnt: z.number(),
  svcSrtTe: z.string(),
  svcEndTe: z.string(),
  tenMin: z.number(),
  ftDay: z.number(),
  ftMon: z.number(),
  pkGubun: z.string(),
})
export type ParkingSchema = z.infer<typeof ParkingSchema>
