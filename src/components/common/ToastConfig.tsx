import { Text, View } from 'react-native'
import { type ToastConfig } from 'react-native-toast-message'

import { SvgIcon } from '@/shared'

export const toastConfig: ToastConfig = {
  info: ({ text1 }) => (
    <View className="min-w-[65%] flex-1 flex-row items-center justify-center rounded-full bg-neutral-900 bg-opacity-70 px-4 py-4">
      <Text className="text-center text-sm font-bold text-white">{text1}</Text>
    </View>
  ),
  notice: ({ text1 }) => (
    <View className="absolute top-2 w-5/6 flex-row items-center rounded-xl border-2 border-red-500 bg-[#FFF0F0] p-4">
      <SvgIcon name="notice" />
      <Text className="ml-2 text-sm font-semibold text-black">{text1}</Text>
    </View>
  ),
}
