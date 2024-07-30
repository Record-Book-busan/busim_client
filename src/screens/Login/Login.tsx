import { login, isLogined } from '@react-native-kakao/user'
import { useState, useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import icoLogo from '@/assets/images/logo_white.png'
import { ImageVariant, SafeScreen, SvgIcon } from '@/shared'

import type { RootScreenProps } from '@/types/navigation'

function Login({ navigation }: RootScreenProps<'Login'>) {
  const [notice, setNotice] = useState('')

  /**
   * 카카오 로그인
   */
  const kakaoLogin = useCallback(async () => {
    if (!(await isLogined())) {
      await login()
    }

    if (await isLogined()) {
      navigation.navigate('MainTab')
    } else {
      setNotice('카카오 로그인에 실패하였습니다.')
      setTimeout(() => {
        setNotice('')
      }, 1000)
    }
  }, [navigation])

  const wrapKakaoLogin = useCallback(() => {
    void kakaoLogin()
  }, [kakaoLogin])

  /**
   * 비회원 로그인
   */
  const unAuthorizedLogin = useCallback(() => {
    setNotice('비회원 로그인 시, 일부 기능들이 제한됩니다.')
    setTimeout(() => {
      navigation.navigate('MainTab')
      setNotice('')
    }, 1000)
  }, [navigation])

  return (
    <SafeScreen>
      <View className="flex w-full flex-1 items-center justify-between bg-white px-10 py-20">
        {!!notice && (
          <View className="absolute top-12 w-full flex-row items-center rounded-xl border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
            <SvgIcon name="notice" />
            <Text className="ml-2 text-sm font-semibold text-black">{notice}</Text>
          </View>
        )}

        <View className="w-full items-center">
          <ImageVariant className="mb-8 mt-10 h-32 w-3/4" source={icoLogo} />
          <Text className="text-lg">안녕하세요!</Text>
          <Text>끼록부에 오신 것을 환영합니다.</Text>
          <Text className="mt-8 text-xl font-bold">로그인하기</Text>
        </View>

        <View className="w-full gap-2">
          <TouchableOpacity
            className="relative flex-row items-center rounded-lg bg-[#FEE500] px-4 py-4"
            onPress={wrapKakaoLogin}
          >
            <SvgIcon name="kakao" size={20} />
            <Text className="flex-1 text-center text-[#191919]">카카오로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity className="relative flex-row items-center rounded-lg bg-black px-4 py-4">
            <SvgIcon name="apple" size={20} color="white" />
            <Text className="flex-1 text-center text-white">Apple로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity className="relative flex-row items-center rounded-lg border border-gray-300 bg-white px-4 py-4">
            <SvgIcon name="google" size={20} />
            <Text className="flex-1 text-center font-[Roboto-Medium] text-[#757575]">
              Google로 계속하기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="relative flex-row items-center rounded-lg bg-gray-300 px-4 py-4"
            onPress={unAuthorizedLogin}
          >
            <SvgIcon name="user" size={20} />
            <Text className="flex-1 text-center text-[#191919]">비회원으로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default Login
