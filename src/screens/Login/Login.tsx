import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { useState } from 'react'
import { Platform, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { logoWelcome } from '@/assets/images'
import { GuestPopup, LoginButton } from '@/components/auth'
import { SafeScreen } from '@/components/common'
import { useAuth } from '@/hooks/useAuthContext'
import { type LoginProvider, ROLE } from '@/services/auth'
import { ImageVariant } from '@/shared'

import type { AuthStackParamList, RootStackParamList } from '@/types/navigation'

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList & AuthStackParamList,
  'Login'
>

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { signIn } = useAuth()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleSignInProcess = async (provider: LoginProvider) => {
    if (provider === 'guest') {
      setIsOpen(true)
      return
    }

    try {
      const role = await signIn(provider)

      switch (role) {
        case ROLE.MEMBER:
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Authenticated',
                state: {
                  routes: [
                    {
                      name: 'MainTab',
                      state: {
                        routes: [{ name: 'Map' }],
                      },
                    },
                  ],
                },
              },
            ],
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

  const handleConfirmPress = (isSharedGuest: boolean) => {
    const handleGuestSignIn = async () => {
      try {
        await signIn(isSharedGuest ? 'share' : 'guest')

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Authenticated',
              state: {
                routes: [
                  {
                    name: 'MainTab',
                    state: {
                      routes: [{ name: 'Map' }],
                    },
                  },
                ],
              },
            },
          ],
        })

        setIsOpen(false)
      } catch (error) {
        console.error(`[ERROR] guest 로그인 중 오류 발생:`, error)
      }
    }

    handleGuestSignIn()
  }

  return (
    <SafeScreen
      excludeEdges={['bottom']}
      statusBarColor={'#5e7dc0'}
      textColor={'light-content'}
      isTranslucent={true}
    >
      {isOpen && <GuestPopup onPress={handleConfirmPress} />}
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
            <LoginButton provider="apple" onPress={() => handleSignInProcess('apple')} />
          )}
          <LoginButton provider="kakao" onPress={() => handleSignInProcess('kakao')} />
          <LoginButton provider="guest" onPress={() => handleSignInProcess('guest')} />
        </View>
      </LinearGradient>
    </SafeScreen>
  )
}
