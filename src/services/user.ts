import { useMutation } from '@tanstack/react-query'

import { type UserInfo, UserInfoSchema } from '@/types/schemas/user'

import { instance } from './instance'

/**
 * 유저 정보를 수정합니다.
 * @param nickName - 닉네임
 * @param profileImage - 이미지 URL
 * @returns
 */
export const post_userInfo = async (params: UserInfo) => {
  const data = UserInfoSchema.parse(params)
  return await instance('api/').post('user/info', { json: data }).json()
}
/** 유저 정보를 수정하는 훅입니다. */
export const useUpdateUserInfo = () => {
  const { mutate } = useMutation({
    mutationFn: post_userInfo,
  })
  return { mutateUserInfo: mutate }
}
