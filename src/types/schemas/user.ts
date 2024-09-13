import { z } from 'zod'

export const userSchema = z.object({
  name: z.string(),
})

export const UserInfoSchema = z.object({
  nickName: z.string(),
  profileImage: z.string().optional(),
})
export type UserInfo = z.infer<typeof UserInfoSchema>
