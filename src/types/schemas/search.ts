import { z } from 'zod'

export const PlaceSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url(),
  category: z.string(),
})

export type Place = z.infer<typeof PlaceSchema>
export const PlaceArraySchema = z.array(PlaceSchema)
