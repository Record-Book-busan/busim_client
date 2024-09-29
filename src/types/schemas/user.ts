import { z } from 'zod'

export const UserInfoSchema = z.object({
  nickname: z.string(),
  profileImage: z.string().optional(),
  email: z.string().nullable(),
})
export type UserInfo = z.infer<typeof UserInfoSchema>

export const InterestsSchema = z.object({
  touristCategories: z.array(z.string()),
  restaurantCategories: z.array(z.string()),
})
export type InterestsSchema = z.infer<typeof InterestsSchema>
