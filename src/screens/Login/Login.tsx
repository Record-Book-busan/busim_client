import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { SafeScreen } from '@/components/common'
import { kakaoLogin, unAuthorizedLogin } from '@/services/login/login'
import { ImageVariant, SvgIcon } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [notice, setNotice] = useState('')

  const handleWrapKakaoLogin = useCallback(() => {
    navigation.navigate('MainTab', { screen: 'Map' })

    // const isSuccess = await kakaoLogin(setNotice)
    // if(isSuccess) navigation.navigate('PrivacyPolicy')
  }, [kakaoLogin])

  const handleWrapUnAuthorizedLogin = useCallback(async () => {
    await unAuthorizedLogin(setNotice)
    navigation.navigate('PrivacyPolicy')

    // navigation.navigate('MainTab', { screen: 'Map' })
  }, [unAuthorizedLogin])

  return (
    <SafeScreen bgColor="#5e7dc0" textColor="light-content">
      <LinearGradient
        className="flex w-full flex-1 items-center justify-between px-10 py-20"
        colors={['#5e7dc0', '#bac8e4', '#FFFFFF']}
      >
        {!!notice && (
          <View className="absolute top-2 w-full flex-row items-center rounded-xl border border-[#FF0000] bg-[#FFF0F0] px-3 py-4">
            <SvgIcon name="notice" />
            <Text className="ml-2 text-sm font-semibold text-black">{notice}</Text>
          </View>
        )}

        <View className="w-full items-center">
          <ImageVariant className="mb-6 mt-10 h-32 w-3/4" source={logoWelcome} />
          <Text className="font-bold">끼록부에 오신 것을 환영합니다.</Text>
        </View>

        <View className="w-full gap-2">
          <Text className="mb-16 text-center text-xl font-bold">로그인하기</Text>
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
              onPress={handleWrapUnAuthorizedLogin}
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
