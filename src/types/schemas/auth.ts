import { z } from 'zod'

// const USER = {
//   GUEST: 'GUEST',
//   MEMBER: 'MEMBER',
// }

export const AuthSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  userId: z.number(),
})
