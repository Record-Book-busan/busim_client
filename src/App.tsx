import 'react-native-gesture-handler'

import { useEffect } from 'react'
import { initializeKakaoSDK } from '@react-native-kakao/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MMKV } from 'react-native-mmkv'

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
      <ApplicationNavigator />
    </QueryClientProvider>
  )
}

export default App
