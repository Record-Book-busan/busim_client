import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuthContext'
import { UserInfoSchema } from '@/types/schemas/user'

import { instance } from './instance'

/** 회원 정보를 조회하는 훅입니다. */
export const useGetUserInfo = () => {
  const queryClient = useQueryClient()
  const { state } = useAuth()
  const isGuest = state.role === 'GUEST' || state.role === 'SHARE'
  const initData = {
    nickname: 'Guest',
    profileImage: '',
    email: '',
  }

  const { data } = useQuery({
    queryKey: ['userInfo'],
    queryFn: get_userInfo,
    enabled: !!state?.role && !isGuest,
    initialData: initData,
  })

  const resetUserInfo = () => {
    queryClient.setQueryData(['userInfo'], initData)
  }

  return {
    data,
    resetUserInfo,
  }
}

/**
 * 회원 정보를 조회합니다.
 */
export const get_userInfo = async () => {
  const response = await instance('kkilogbu/').get('users').json()
  return UserInfoSchema.parse(response)
}

/**
 * 프로필 이미지를 수정합니다.
 * @param profileImage - 프로필 이미지 url
 */
export const post_profile_img = async (params: { profileImage: string }) => {
  return await instance('kkilogbu/').post('users/image', { json: params }).json()
}

/**
 * 닉네임을 수정합니다.
 * @param nickName - 닉네임
 */
export const post_nickname = async (params: { nickName: string }) => {
  return await instance('kkilogbu/').post('users/name', { json: params }).json()
}

/**
 * 닉네임을 중복체크 합니다.
 * @param nickName - 닉네임
 */
export const post_check_nickname = async (params: { nickName: string }): Promise<boolean> => {
  return await instance('kkilogbu/').post('users/name/check', { json: params }).json()
}
