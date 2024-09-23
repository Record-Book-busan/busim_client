import Clipboard from '@react-native-clipboard/clipboard'
import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { getUniqueId } from 'react-native-device-info'

import { Typo } from '@/shared'
import { storage } from '@/utils/storage'
import { showToast } from '@/utils/toast'

export const DebugFloatingButton = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const copyToClipboard = (key: string, value: string) => {
    Clipboard.setString(value)
    showToast({
      text: `${key}를 클립보드에 복사했습니다`,
      position: 'bottom',
    })
  }

  const handleCopyAccessToken = () => {
    const accessToken = storage.getString('code')
    if (accessToken) {
      copyToClipboard('Access Token', accessToken)
    } else {
      showToast({
        text: 'code가 존재하지 않습니다',
        position: 'bottom',
      })
    }
  }

  const handleCopyIdToken = () => {
    const idToken = storage.getString('idToken')
    if (idToken) {
      copyToClipboard('ID Token', idToken)
    } else {
      showToast({
        text: 'ID Token이 존재하지 않습니다',
        position: 'bottom',
      })
    }
  }

  const handleCopyDeviceId = async () => {
    const deviceId = await getUniqueId()
    copyToClipboard('Device ID', deviceId)
  }

  const handleClearCache = () => {
    storage.clearAll()
    showToast({
      text: 'MMKV 저장소를 모두 지웠습니다',
      position: 'bottom',
    })
  }

  console.log(isExpanded)

  return (
    <View className="absolute right-0 top-12 w-24 items-center justify-center">
      <Pressable
        className={`h-10 w-10 items-center justify-center rounded-full bg-white shadow ${isExpanded && 'bg-gray-100'}`}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Typo className="font-Bold text-lg text-orange-500">D</Typo>
      </Pressable>
      {isExpanded && (
        <View className="absolute right-3 top-12 w-24 gap-1 rounded shadow">
          <Pressable
            className="items-center rounded bg-orange-500 px-3 py-1"
            onPress={handleCopyAccessToken}
          >
            <Typo className="font-SemiBold text-sm text-white">Code</Typo>
          </Pressable>
          <Pressable
            className="items-center rounded bg-orange-500 px-3 py-1"
            onPress={handleCopyIdToken}
          >
            <Typo className="font-SemiBold text-sm text-white">IDToken</Typo>
          </Pressable>
          <Pressable
            className="items-center rounded bg-orange-500 px-3 py-1"
            onPress={handleCopyDeviceId}
          >
            <Typo className="font-SemiBold text-sm text-white">Device ID</Typo>
          </Pressable>
          <Pressable
            className="items-center rounded bg-red-600 px-3 py-1"
            onPress={handleClearCache}
          >
            <Typo className="font-SemiBold text-sm text-white">캐시 지우기</Typo>
          </Pressable>
        </View>
      )}
    </View>
  )
}
