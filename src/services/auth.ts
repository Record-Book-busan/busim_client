import appleAuth from '@invertase/react-native-apple-authentication'
import { login, logout, isLogined, me } from '@react-native-kakao/user'
import { getUniqueId } from 'react-native-device-info'

import { AuthSchema } from '@/types/schemas/auth'
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
  const tasks = [
    storage.delete('userInfo'),
    isLogined().then(logged => (logged ? logout() : Promise.resolve())),
  ]
  await Promise.all(tasks)
}

/**
 * 카카오 로그인을 수행합니다.
 */
const kakaoSignIn = async (): Promise<Role> => {
  await login()
  if (await isLogined()) {
    const userInfo = await me()
    storage.set('userInfo', JSON.stringify(userInfo))
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

    await Promise.all([
      storage.set('accessToken', response?.accessToken),
      storage.set('refreshToken', response?.refreshToken),
      storage.set('userId', response.userId.toString()),
      storage.set('isLoggedIn', 'true'),
    ])

    return getUserRole(false)
  }
  throw new Error('애플 로그인 실패')
}

/**
 * 비회원 로그인을 수행합니다.
 */
const guestSignIn = (): Role => {
  showToast({
    text: '비회원 로그인 시, 일부 기능들이 제한됩니다.',
    type: 'notice',
    position: 'top',
  })
  return ROLE.GUEST
}

/**
 * 지정된 제공자를 사용하여 로그인을 수행합니다.
 */
export const loginWithProvider = async (provider: LoginProvider): Promise<Role> => {
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
  const response = await instance('kkilogbu/').post('user/signin/apple', { json: params }).json()
  return AuthSchema.parse(response)
}
