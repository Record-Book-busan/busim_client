import { Text, View } from 'react-native'
import { type ToastConfig } from 'react-native-toast-message'

import { SvgIcon } from '@/shared'

export const toastConfig: ToastConfig = {
  default: ({ text1 }) => (
    <View className="w-5/6 flex-1 flex-row items-center rounded-full bg-neutral-950 bg-opacity-70 p-4">
      <Text className="flex-1 text-center text-sm font-semibold text-white">{text1}</Text>
    </View>
  ),
  notice: ({ text1 }) => (
    <View className="absolute top-2 w-5/6 flex-row items-center rounded-xl border-2 border-red-500 bg-[#FFF0F0] p-4">
      <SvgIcon name="notice" />
      <Text className="ml-2 text-sm font-semibold text-black">{text1}</Text>
    </View>
  ),
}
