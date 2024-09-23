import { Platform, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { LoginButton } from '@/components/auth'
import { DebugFloatingButton, SafeScreen } from '@/components/common'
import { type LoginProvider, handleSocialLogin } from '@/services/auth'
import { ImageVariant } from '@/shared'

export default function LoginScreen() {
  const handleSignIn = async (provider: LoginProvider) => {
    await handleSocialLogin(provider)
  }

  return (
    <SafeScreen
      excludeEdges={['bottom']}
      bgColor={'#5e7dc0'}
      statusBarColor={'light-content'}
      isTranslucent={true}
    >
      <LinearGradient
        className="flex w-full flex-1 items-center justify-start"
        colors={['#5e7dc0', '#bac8e4', '#FFFFFF']}
      >
        <View className="w-full items-center">
          <ImageVariant className="mb-6 mt-10 h-1/2 w-3/4" source={logoWelcome} />
          <Text className="text-lg font-normal text-gray-700">끼록부에 오신 것을 환영합니다!</Text>
        </View>

        <View className="px-6" style={{ gap: 12 }}>
          {Platform.OS === 'ios' && (
            <LoginButton provider="apple" onPress={() => handleSignIn('apple')} />
          )}
          <LoginButton provider="kakao" onPress={() => handleSignIn('kakao')} />
          <LoginButton provider="guest" onPress={() => handleSignIn('guest')} />
        </View>
      </LinearGradient>
      <DebugFloatingButton />
    </SafeScreen>
  )
}
