import 'react-native-gesture-handler'
import { initializeKakaoSDK } from '@react-native-kakao/core'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { MMKV } from 'react-native-mmkv'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { toastConfig } from './components/common'
import ApplicationNavigator from './navigators/Application'

import './translations'

export const queryClient = new QueryClient()

export const storage = new MMKV()

async function initializeSDK() {
  try {
    await initializeKakaoSDK(`${process.env.KakaoNativeApiKey}`, {
      web: {
        javascriptKey: `${process.env.KakaoJsApiKey}`,
        restApiKey: `${process.env.KakaoRestApiKey}`,
      },
    })
  } catch (error) {
    console.error('kakao SDK 초기화 중 오류 발생', error)
  }
}

function App() {
  useEffect(() => {
    void initializeSDK()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ApplicationNavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

export default App
