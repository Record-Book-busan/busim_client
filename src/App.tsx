import 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MMKV } from 'react-native-mmkv'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { toastConfig } from './components/common'
import { PopupProvider } from './hooks/usePopup'
import ApplicationNavigator from './navigators/Application'

import './translations'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      throwOnError: true,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
    },
  },
})

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
    getKeyHashAndroid().then(response => console.log(`hashKey: ${response}`))
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <PopupProvider>
                <ApplicationNavigator />
              </PopupProvider>
            </SafeAreaProvider>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App
