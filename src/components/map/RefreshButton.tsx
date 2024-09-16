import { TouchableOpacity, View, Text } from 'react-native'

import { SvgIcon } from '@/shared'

type RefreshButtonProps = {
  onPress: () => void
}

export function RefreshButton({ onPress }: RefreshButtonProps) {
  return (
    <TouchableOpacity
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
      <View className="flex w-full flex-row items-center justify-center gap-4">
        <Text className="font-bold">현지도에서 재검색</Text>
        <SvgIcon name="refresh" className="rotate-45 text-black" />
      </View>
    </TouchableOpacity>
  )
}
