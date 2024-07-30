import { login, isLogined } from '@react-native-kakao/user'
import { useNavigation } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import { logoWhite } from '@/assets'
import { SafeScreen, SvgIcon, ImageVariant } from '@/shared'

function Login() {
  const [notice, setNotice] = useState('')
  const navigation = useNavigation()

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
      <View className="flex w-full flex-1 items-center rounded-xl bg-white">
        {!!notice && (
          <View className="absolute top-12 w-3/4 flex-row items-center rounded-xl border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
            <SvgIcon name="notice" />
            <Text className="ml-2 text-sm font-semibold text-black">{notice}</Text>
          </View>
        )}
        <ImageVariant className="mt-52 h-32 w-3/4" source={logoWhite} />
        <Text className="text-sm text-black">안녕하세요!</Text>
        <Text className="mb text-sm text-black">끼록부에 오신 것을 환영합니다.</Text>
        <Text className="my-12 text-xl font-bold text-black">로그인하기</Text>
        <View className="w-3/4 gap-2 rounded-xl">
          <TouchableOpacity className="rounded-xl bg-yellow-300" onPress={wrapKakaoLogin}>
            <View className="absolute left-5 top-1/2 -translate-y-2">
              <SvgIcon name="kakao" />
            </View>
            <Text className="py-4 text-center text-sm text-black">카카오로 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-xl bg-black">
            <View className="absolute left-5 top-1/2 -translate-y-4">
              <SvgIcon name="apple" />
            </View>
            <Text className="py-4 text-center text-sm text-white">Apple로 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-xl border border-gray-300 bg-white">
            <View className="absolute left-5 top-1/2 -translate-y-3">
              <SvgIcon name="google" />
            </View>
            <Text className="py-4 text-center text-sm text-black">Google로 계속하기</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-xl bg-gray-300" onPress={unAuthorizedLogin}>
            <View className="absolute left-5 top-1/2 -translate-y-3">
              <SvgIcon name="user" />
            </View>
            <Text className="py-4 text-center text-sm text-black">비회원으로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default Login
