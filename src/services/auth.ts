import appleAuth from '@invertase/react-native-apple-authentication'
import { login, logout, isLogined, me } from '@react-native-kakao/user'
import { getUniqueId } from 'react-native-device-info'

import { storage } from '@/utils/storage'
import { showToast } from '@/utils/toast'

// import { post_signin_apple } from './service'

/**
 * 모든 로그인 로그아웃 처리
 */
const logoutAll = async () => {
  storage.delete('kakaoUserInfo')
  storage.delete('appleUserInfo')

  if (await isLogined()) {
    await logout() // 카카오 로그아웃
  }

  return true
}

/**
 * 카카오 로그인(https://rnkakao.dev/docs/intro)
 * @param navigation
 * @param setNotice
 */
const kakaoLogin = async () => {
  if (await logoutAll()) {
    const data = await login()
    console.log(JSON.stringify(data))

    if (await isLogined()) {
      storage.set('kakaoUserInfo', JSON.stringify(await me()))
      return true
    } else {
      showToast({
        text: '카카오 로그인에 실패하였습니다.',
        type: 'notice',
        position: 'top',
      })
      return false
    }
  } else {
    return false
  }
}

interface AppleSignInProps {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

/**
 * 애플 로그인(https://github.com/invertase/react-native-apple-authentication)
 */
const appleSignIn = async ({ onSuccess, onError }: AppleSignInProps) => {
  try {
    // 애플 로그인 요청
    const auth = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
    })
    // 사용자 인증 상태 확인
    const credentialState = await appleAuth.getCredentialStateForUser(auth.user)

    if (credentialState === appleAuth.State.AUTHORIZED) {
      if (auth.identityToken && auth.authorizationCode) {
        // FIXME: 로그인 요청 api 수정 후 주석 해제해주시면 됩니다.
        // 서버에 로그인 요청
        // const response = await post_signin_apple({
        //   identityToken: auth.identityToken,
        //   authorizationCode: auth.authorizationCode,
        // })
        const deviceId = await getUniqueId()
        console.log(deviceId)
        console.log(auth.identityToken)
        console.log(auth.authorizationCode)

        // storage.set('accessToken', response?.accessToken)
        // storage.set('refreshToken', response?.refreshToken)
        // storage.set('userId', response.id.toString())

        onSuccess?.()
      } else {
        throw new Error('[ERROR Apple Auth]: 애플 토큰이 없습니다.')
      }
    } else {
      throw new Error('[ERROR Apple Auth]: 사용자 권한이 없습니다.')
    }
  } catch (error) {
    console.error('[ERROR application]:', error)
    onError?.(error)
  }
}

/**
 * 비회원 로그인
 * @param setNotice
 */
const unAuthorizedLogin = async () => {
  if (await logoutAll()) {
    showToast({
      text: '비회원 로그인 시, 일부 기능들이 제한됩니다.',
      type: 'notice',
      position: 'top',
    })
    return true
  } else {
    return false
  }
}

/**
 * 로그인 정보 표출
 */
const showLoginInfo = () => {
  const kakaoUserInfo = storage.getString('kakaoUserInfo')
  const appleUserInfo = storage.getString('appleUserInfo')

  if (kakaoUserInfo) {
    console.log(`카카오 로그인: ${JSON.stringify(JSON.parse(kakaoUserInfo))}`)
  } else {
    console.log('카카오 로그아웃 상태입니다.')
  }
  if (appleUserInfo) {
    console.log(`애플 로그인: ${JSON.stringify(JSON.parse(appleUserInfo))}`)
  } else {
    console.log('애플 로그아웃 상태입니다.')
  }
}

export { kakaoLogin, appleSignIn, unAuthorizedLogin, showLoginInfo, logoutAll }
