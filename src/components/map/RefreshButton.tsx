import { Pressable, View } from 'react-native'

import { SvgIcon, Typo } from '@/shared'

type RefreshButtonProps = {
  onPress: () => void
}

export function RefreshButton({ onPress }: RefreshButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex w-48 items-center justify-center self-center rounded-full bg-white py-2"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View className="flex w-full flex-row items-center justify-center gap-x-2">
        <Typo className="font-SemiBold">현지도에서 재검색</Typo>
        <SvgIcon name="refresh" size={24} className="text-black" />
      </View>
    </Pressable>
  )
}
