import { login, isLogined } from '@react-native-kakao/user'
import { useState, useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import icoLogo from '@/assets/images/logo_white.png'
import { ImageVariant, SafeScreen, SvgIcon } from '@/shared'
import icoNotice from '@/theme/assets/images/ico-notice.png'
import icoUser from '@/theme/assets/images/ico-user.png'
import { RootScreenProps } from '@/types/navigation'

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
      <View className="flex flex-1 items-center bg-white">
        {!!notice && (
          <View className="absolute top-12 w-3/4 flex-row items-center border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
            <ImageVariant source={icoNotice} />
            <Text className="ml-2 font-semibold">{notice}</Text>
          </View>
        )}
        <ImageVariant className="mt-52 h-32 w-3/4 bg-red-200" source={icoLogo} />
        <Text>안녕하세요!</Text>
        <Text className="mb">끼록부에 오신 것을 환영합니다.</Text>
        <Text className="my-12 text-xl font-bold">로그인하기</Text>
        <View className="w-3/4 gap-2">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg bg-[#FEE500] py-4"
            onPress={wrapKakaoLogin}
          >
            <SvgIcon name="kakao" className="mr-2" size={20} />
            <Text className="text-[#191919]">카카오 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-center rounded-lg bg-black py-4">
            <SvgIcon name="apple" className="mr-2" size={20} />
            <Text className="text-white">Apple로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-4">
            <SvgIcon name="google" className="mr-2" size={20} />
            <Text className="font-[Roboto-Medium] text-[#757575]">Google로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg bg-gray-300 py-4"
            onPress={unAuthorizedLogin}
          >
            <ImageVariant className="mr-2" source={icoUser} />
            <Text className="text-[#191919]">비회원으로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default Login
