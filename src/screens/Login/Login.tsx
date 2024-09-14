import { type NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, StatusBar, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { LoginButton } from '@/components/auth'
import { SafeScreen } from '@/components/common'
import { kakaoLogin, unAuthorizedLogin, appleSignIn } from '@/services/auth'
import { ImageVariant } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const handleSignInKakao = async () => {
    if (await kakaoLogin()) {
      navigation.navigate('PrivacyPolicy')
    } else {
      console.log('카카오 로그인에 실패하였습니다.')
    }
  }

  const handleSignInApple = async () => {
    await appleSignIn({
      onSuccess: () => navigation.navigate('PrivacyPolicy'),
      onError: () => console.log('에러 알람~!!'),
    })
  }

  const handleSignInGuest = async () => {
    if (await unAuthorizedLogin()) {
      navigation.navigate('MainTab', {
        screen: 'Map',
        params: { screen: 'MapHome', params: { categories: [] } },
      })
    } else {
      console.log('비회원 로그인에 실패하였습니다.')
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#5e7dc0')
      StatusBar.setTranslucent(true)
      StatusBar.setBarStyle('light-content')
    }, []),
  )

  return (
    <SafeScreen excludeEdges={['bottom']}>
      <LinearGradient
        className="flex w-full flex-1 items-center justify-start"
        colors={['#5e7dc0', '#bac8e4', '#FFFFFF']}
      >
        <View className="w-full items-center">
          <ImageVariant className="mb-6 mt-10 h-1/2 w-3/4" source={logoWelcome} />
          <Text className="text-lg font-normal text-gray-700">끼록부에 오신 것을 환영합니다!</Text>
        </View>

        <View className="px-6" style={{ gap: 12 }}>
          <LoginButton provider="kakao" onPress={handleSignInKakao} />
          {Platform.OS === 'ios' && <LoginButton provider="apple" onPress={handleSignInApple} />}
          <LoginButton provider="guest" onPress={handleSignInGuest} />
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
