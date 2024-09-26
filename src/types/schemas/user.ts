import { z } from 'zod'

export const userSchema = z.object({
  name: z.string(),
})

export const UserInfoSchema = z.object({
  nickName: z.string(),
  profileImage: z.string().optional(),
})
export type UserInfo = z.infer<typeof UserInfoSchema>

export const InterestsSchema = z.object({
  touristCategories: z.array(z.string()),
  restaurantCategories: z.array(z.string()),
})
export type InterestsSchema = z.infer<typeof InterestsSchema>
