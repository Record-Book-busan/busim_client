import appleAuth from '@invertase/react-native-apple-authentication'
import { login, logout, isLogined } from '@react-native-kakao/user'
import { useMutation } from '@tanstack/react-query'
import { getUniqueId } from 'react-native-device-info'

import { AppleAuthSchema, KakaoAuthSchema } from '@/types/schemas/auth'
import { storage } from '@/utils/storage'
import { showToast } from '@/utils/toast'

import { instance } from './instance'

export const ROLE = {
  /** 회원 */
  MEMBER: 'MEMBER',
  /** 가입처리가 되지 않은 사용자 */
  PENDING_MEMBER: 'PENDING_MEMBER',
  /** 게스트 */
  GUEST: 'GUEST',
  /** 게스트 */
  SHARE: 'SHARE',
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]

export type LoginProvider = 'kakao' | 'apple' | 'guest' | 'share'

/**
 * 모든 로그인 세션을 로그아웃합니다.
 */
export const logoutAll = async (): Promise<void> => {
  storage.delete('accessToken')
  storage.delete('refreshToken')
  storage.delete('userId')

  const logged = await isLogined()

  if (logged) {
    void logout()
  } else {
    void Promise.resolve()
  }
}

/**
 * 카카오 로그인을 수행합니다.
 */
const kakaoSignIn = async (): Promise<{ role: Role; token: string }> => {
  const loginInfo = await login()
  if (await isLogined()) {
    const response = await post_signin_kakao({
      accessToken: loginInfo.accessToken,
    })
    const role = response?.isAgreed ? ROLE.MEMBER : ROLE.PENDING_MEMBER

    storage.set('loginType', 'kakao')
    storage.set('accessToken', response?.accessToken)
    storage.set('refreshToken', response?.refreshToken)
    storage.set('userId', response.userId.toString())

    return { role, token: response.accessToken }
  }
  throw new Error('카카오 로그인 실패')
}

/**
 * 애플 로그인을 수행합니다.
 */
const appleSignIn = async (): Promise<{ role: Role; token: string }> => {
  const auth = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
  })
  const credentialState = await appleAuth.getCredentialStateForUser(auth.user)

  if (
    credentialState === appleAuth.State.AUTHORIZED &&
    auth.identityToken &&
    auth.authorizationCode
  ) {
    const deviceId = await getUniqueId()
    const response = await post_signin_apple({
      identityToken: auth.identityToken,
      authorizationCode: auth.authorizationCode,
      phoneIdentificationNumber: deviceId,
    })
    const role = response?.isAgreed ? ROLE.MEMBER : ROLE.PENDING_MEMBER

    storage.set('loginType', 'apple')
    storage.set('accessToken', response?.accessToken)
    storage.set('refreshToken', response?.refreshToken)
    storage.set('userId', response.userId.toString())
    storage.set('role', role)

    return { role, token: response.accessToken }
  }
  throw new Error('애플 로그인 실패')
}

/**
 * 비회원 로그인을 수행합니다.
 */
const guestSignIn = async (): Promise<{ role: Role; token: string }> => {
  try {
    showToast({
      text: '비회원 로그인 시, 일부 기능들이 제한됩니다.',
      type: 'notice',
      position: 'top',
    })

    const response = await post_signin_guest()
    storage.set('accessToken', response)
    const role = ROLE.GUEST

    return { role, token: response }
  } catch {
    throw new Error('비회원 로그인 실패')
  }
}

/**
 * 공유 로그인을 수행합니다.
 */
const shareSignIn = (): { role: Role; token: string } => {
  try {
    const shareAccessToken =
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxd2VlcjEyMyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzI4NDY1MTQyLCJleHAiOjE3NDQwMTcxNDJ9.49J3aaK4-ZjMpK-I-uUSdEKoaDQi1ZnqOhuDk0QVif4'
    const role = ROLE.SHARE

    storage.set('loginType', 'share')
    storage.set('accessToken', shareAccessToken)

    return { role, token: shareAccessToken }
  } catch {
    throw new Error('공유 로그인 실패')
  }
}

/**
 * 소셜로그인을 수행합니다.
 */
export const handleSignIn = async (
  provider: LoginProvider,
): Promise<{ role: Role; token: string }> => {
  await logoutAll()

  switch (provider) {
    case 'kakao':
      return kakaoSignIn()
    case 'apple':
      return appleSignIn()
    case 'guest':
      return guestSignIn()
    case 'share':
      return shareSignIn()
    default:
      throw new Error('지원되지 않는 로그인 방식')
  }
}

/**
 * 애플 계정으로 로그인 요청을 합니다.
 */
const post_signin_apple = async (params: {
  identityToken: string
  authorizationCode: string
  phoneIdentificationNumber: string
}) => {
  const response = await instance('kkilogbu/').post('users/signin/apple', { json: params }).json()
  return AppleAuthSchema.parse(response)
}

/**
 * 카카오 계정으로 로그인 요청을 합니다.
 */
const post_signin_kakao = async (params: { accessToken: string }) => {
  const response = await instance('kkilogbu/')
    .post('users/signin/kakao', { searchParams: params })
    .json()
  console.log(response)
  return KakaoAuthSchema.parse(response)
}

/**
 * 비회원으로 로그인 요청을 합니다.
 */
const post_signin_guest = async (): Promise<string> => {
  const response = await instance('kkilogbu/').post('users/signin/anonymous').text()
  console.log(response)
  return response
}

/**
 * 이용 약관 동의 훅입니다.
 */
export const usePostConsent = () => {
  const { mutateAsync } = useMutation({
    mutationFn: post_consent,
  })

  return mutateAsync
}

/**
 * 이용 약관 동의 요청을 합니다.
 */
const post_consent = async (): Promise<string> => {
  const body = {
    termsAgreed: true,
    privacyAgreed: true,
  }

  const response = await instance('kkilogbu/').post(`users/signin/consent`, { json: body }).text()
  return response
}

/**
 * 탈퇴합니다.
 */
export const delete_user_membership = async (): Promise<string> => {
  let response: Promise<string> = new Promise(() => '')

  if (storage.getString('loginType') === 'kakao') {
    response = (await instance('kkilogbu/').delete('users/withdrawal/kakao')).text()
  }

  if (storage.getString('loginType') === 'apple') {
    const userId = storage.getString('userId')
    const accessToken = storage.getString('accessToken')

    if (!!userId && !!accessToken) {
      response = (
        await instance('kkilogbu/').delete(`users/${userId}`, {
          searchParams: { accessToken: accessToken },
        })
      ).text()
    } else {
      throw new Error('storage에 userId 혹은 accessToken이 없습니다.')
    }
  }

  await logoutAll()

  return response
}
