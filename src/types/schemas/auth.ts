import { z } from 'zod'

export const AppleAuthSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  userId: z.number(),
})

export const KakaoAuthSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  userId: z.number(),
})

export const GuestAuthSchema = z.string()
