import { type NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, StatusBar, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { LoginButton } from '@/components/auth'
import { SafeScreen } from '@/components/common'
import { type LoginProvider, handleSocialLogin, ROLE } from '@/services/auth'
import { ImageVariant } from '@/shared'
import { RootStackParamList } from '@/types/navigation'

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const handleSignIn = async (provider: LoginProvider) => {
    try {
      const role = await handleSocialLogin(provider)
      switch (role) {
        case ROLE.MEMBER:
          navigation.navigate('MainTab', {
            screen: 'Map',
            params: { screen: 'MapHome', params: { categories: [] } },
          })
          break
        case ROLE.GUEST:
          navigation.navigate('OnBoardingStack', {
            screen: 'OnBoarding',
          })
          break
        case ROLE.PENDING_MEMBER:
          navigation.navigate('PrivacyPolicy')
          break
      }
    } catch (error) {
      console.error(`[ERROR] ${provider} 로그인 중 오류 발생:`, error)
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
          <LoginButton provider="kakao" onPress={() => handleSignIn('kakao')} />
          {Platform.OS === 'ios' && (
            <LoginButton provider="apple" onPress={() => handleSignIn('apple')} />
          )}
          <LoginButton provider="guest" onPress={() => handleSignIn('guest')} />
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
