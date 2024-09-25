import appleAuth from '@invertase/react-native-apple-authentication'
import { login, logout, isLogined, me } from '@react-native-kakao/user'
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
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]

export type LoginProvider = 'kakao' | 'apple' | 'guest'

/**
 * 이용약관 동의 여부를 확인합니다.
 * @todo 백엔드 로그인 로직 변경 시 제거하시면 됩니다.
 */
const checkTermsAgreement = (): boolean => {
  return storage.getBoolean('hasAgreedToTerms') ?? false
}

/**
 * 사용자 역할을 결정합니다.
 * @todo 백엔드 로그인 로직 변경 시 제거하시면 됩니다.
 */
const getUserRole = (isGuest: boolean): Role => {
  if (isGuest) return ROLE.GUEST
  return checkTermsAgreement() ? ROLE.MEMBER : ROLE.PENDING_MEMBER
}

/**
 * 모든 로그인 세션을 로그아웃합니다.
 */
export const logoutAll = async (): Promise<void> => {
  storage.delete('userInfo')
  storage.delete('authHeader')

  const logged = await isLogined()

  if (logged) logout()
  else Promise.resolve()
}

/**
 * 카카오 로그인을 수행합니다.
 */
const kakaoSignIn = async (): Promise<Role> => {
  const loginInfo = await login()
  console.log(loginInfo)
  if (await isLogined()) {
    const userInfo = await me()
    storage.set('userInfo', JSON.stringify(userInfo))

    const response = await post_signin_kakao({
      accessToken: loginInfo.accessToken,
    })

    storage.set('accessToken', response?.accessToken)
    storage.set('refreshToken', response?.accessToken)
    storage.set('userId', response.userId.toString())

    return getUserRole(false)
  }
  throw new Error('카카오 로그인 실패')
}

/**
 * 애플 로그인을 수행합니다.
 */
const appleSignIn = async (): Promise<Role> => {
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

    storage.set('accessToken', response?.accessToken)
    storage.set('refreshToken', response?.accessToken)
    storage.set('userId', response.userId.toString())

    return getUserRole(false)
  }
  throw new Error('애플 로그인 실패')
}

/**
 * 비회원 로그인을 수행합니다.
 */
const guestSignIn = async (): Promise<Role> => {
  try {
    showToast({
      text: '비회원 로그인 시, 일부 기능들이 제한됩니다.',
      type: 'notice',
      position: 'top',
    })

    const response = await post_signin_guest()

    storage.set('accessToken', response)

    return ROLE.GUEST
  } catch {
    throw new Error('비회원 로그인 실패')
  }
}

/**
 * 소셜로그인을 수행합니다.
 */
export const handleSocialLogin = async (provider: LoginProvider): Promise<Role> => {
  await logoutAll()

  switch (provider) {
    case 'kakao':
      return kakaoSignIn()
    case 'apple':
      return appleSignIn()
    case 'guest':
      return guestSignIn()
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
