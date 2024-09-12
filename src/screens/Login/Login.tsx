import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { SafeScreen } from '@/components/common'
import { kakaoLogin, unAuthorizedLogin, appleLogin } from '@/services/login/login'
import { ImageVariant, SvgIcon } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [notice, setNotice] = useState('')

  const handleWrapKakaoLogin = useCallback(async () => {
    if (await kakaoLogin(setNotice)) {
      navigation.navigate('PrivacyPolicy')
    } else {
      console.log('카카오 로그인에 실패하였습니다.')
    }
  }, [kakaoLogin])

  const handleWrapUnAuthorizedLogin = useCallback(async () => {
    if (await unAuthorizedLogin(setNotice)) {
      navigation.navigate('MainTab', {
        screen: 'Map',
        params: { screen: 'MapHome', params: { categories: [] } },
      })
    } else {
      console.log('비회원 로그인에 실패하였습니다.')
    }
  }, [unAuthorizedLogin])

  const handleWrapAppleLogin = useCallback(async () => {
    if (await appleLogin(setNotice)) {
      navigation.navigate('PrivacyPolicy')
    } else {
      console.log('애플 로그인에 실패하였습니다.')
    }
  }, [appleLogin])

  return (
    <SafeScreen bgColor="#5e7dc0" textColor="light-content">
      <LinearGradient
        className="flex w-full flex-1 items-center justify-start"
        colors={['#5e7dc0', '#bac8e4', '#FFFFFF']}
      >
        {!!notice && (
          <View className="absolute top-2 w-5/6 flex-row items-center rounded-xl border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
            <SvgIcon name="notice" />
            <Text className="ml-2 text-sm font-semibold text-black">{notice}</Text>
          </View>
        )}

        <View className="w-full items-center">
          <ImageVariant className="mb-6 mt-10 h-1/2 w-3/4" source={logoWelcome} />
          <Text className="font-bold">끼록부에 오신 것을 환영합니다.</Text>
        </View>

        <View className="w-5/6 gap-2">
          <Text className="mb-8 text-center text-xl font-bold">로그인하기</Text>
          <TouchableOpacity
            className="relative flex-row items-center rounded-lg bg-[#FEE500] px-4 py-4"
            onPress={handleWrapKakaoLogin}
          >
            <SvgIcon name="kakao" size={20} />
            <Text className="flex-1 text-center font-bold text-[#191919]">카카오로 계속하기</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              className="relative flex-row items-center rounded-lg bg-black px-4 py-4"
              onPress={handleWrapAppleLogin}
            >
              <SvgIcon name="apple" size={20} color="white" />
              <Text className="flex-1 text-center font-bold text-white">Apple로 계속하기</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="relative flex-row items-center rounded-lg bg-gray-300 px-4 py-4"
            onPress={handleWrapUnAuthorizedLogin}
          >
            <SvgIcon name="user" size={20} />
            <Text className="flex-1 text-center font-bold text-[#191919]">비회원으로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
