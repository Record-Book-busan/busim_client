import appleAuth from '@invertase/react-native-apple-authentication'
import { login, logout, isLogined, me } from '@react-native-kakao/user'

import { storage } from '@/utils/storage'

/**
 * 모든 로그인 로그아웃 처리
 */
const logoutAll = async () => {
  storage.delete('kakaoUserInfo')
  storage.delete('appleUserInfo')

  if (await isLogined()) {
    await logout() // 카카오 로그아웃
  }
}

/**
 * 카카오 로그인(https://rnkakao.dev/docs/intro)
 * @param navigation
 * @param setNotice
 */
const kakaoLogin = async (setNotice: (value: string) => void) => {
  await logoutAll()
  const data = await login()
  console.log(JSON.stringify(data))

  if (await isLogined()) {
    storage.set('kakaoUserInfo', JSON.stringify(await me()))
    return true
  } else {
    setNotice('카카오 로그인에 실패하였습니다.')
    await new Promise(res => setTimeout(res, 1000))
    setNotice('')
    return false
  }
}

/**
 * 애플 로그인(https://github.com/invertase/react-native-apple-authentication)
 */
const appleLogin = async (setNotice: (value: string) => void) => {
  await logoutAll()
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  })
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

  if (credentialState === appleAuth.State.AUTHORIZED) {
    storage.set('appleUserInfo', JSON.stringify(credentialState))
    return true
  } else {
    setNotice('애플 로그인에 실패하였습니다.')
    await new Promise(res => setTimeout(res, 1000))
    setNotice('')
    return false
  }
}

/**
 * 비회원 로그인
 * @param setNotice
 */
const unAuthorizedLogin = async (setNotice: (value: string) => void) => {
  await logoutAll()
  setNotice('비회원 로그인 시, 일부 기능들이 제한됩니다.')
  await new Promise(res => setTimeout(res, 1000))
  setNotice('')
}

/**
 * 로그인 정보 표출
 */
const showLoginInfo = () => {
  const kakaoUserInfo = storage.getString('kakaoUserInfo')
  const appleUserInfo = storage.getString('appleUserInfo')

  if (kakaoUserInfo) console.log(`카카오 로그인: ${JSON.stringify(JSON.parse(kakaoUserInfo))}`)
  if (appleUserInfo) console.log(`애플 로그인: ${JSON.stringify(JSON.parse(appleUserInfo))}`)
}

export { kakaoLogin, appleLogin, unAuthorizedLogin, showLoginInfo }
